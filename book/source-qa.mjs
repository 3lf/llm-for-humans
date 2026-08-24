import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const STRONG_CHARACTER = /[\p{Script=Arabic}\p{Script=Latin}]/u;
const LATIN_CHARACTER = /\p{Script=Latin}/u;
const SLUG_CHARACTER = /[\p{Alphabetic}\p{Mark}\p{Number}]/u;

function splitBlockQuotePrefix(line) {
  let cursor = 0;
  let depth = 0;

  while (true) {
    const markerStart = cursor;
    let indentation = 0;
    while (indentation < 3 && line[cursor] === ' ') {
      cursor += 1;
      indentation += 1;
    }
    if (line[cursor] !== '>') {
      cursor = markerStart;
      break;
    }
    cursor += 1;
    if (line[cursor] === ' ') cursor += 1;
    depth += 1;
  }

  return { body: line.slice(cursor), depth };
}

function parseFenceOpener(line) {
  const quote = splitBlockQuotePrefix(line);
  const match = quote.body.match(/^ {0,3}(`{3,}|~{3,})(.*)$/u);
  if (!match) return null;

  const marker = match[1];
  if (marker[0] === '`' && match[2].includes('`')) return null;
  return { character: marker[0], depth: quote.depth, length: marker.length };
}

function isFenceCloser(line, fence) {
  const quote = splitBlockQuotePrefix(line);
  if (quote.depth !== fence.depth) return false;
  const match = quote.body.match(/^ {0,3}(`+|~+)[ \t]*$/u);
  return Boolean(
    match
    && match[1][0] === fence.character
    && match[1].length >= fence.length,
  );
}

function sourceLines(source) {
  const result = [];
  let fence = null;

  for (const [index, line] of source.split(/\r?\n/u).entries()) {
    if (fence) {
      if (isFenceCloser(line, fence)) {
        fence = null;
        result.push({ closingFence: true, inFence: true, line, lineNumber: index + 1 });
      } else {
        result.push({ closingFence: false, inFence: true, line, lineNumber: index + 1 });
      }
      continue;
    }

    const opener = parseFenceOpener(line);
    if (opener) {
      fence = opener;
      result.push({ closingFence: false, inFence: true, line, lineNumber: index + 1 });
      continue;
    }

    result.push({ closingFence: false, inFence: false, line, lineNumber: index + 1 });
  }

  return result;
}

export function findUnsafeGitHubBlockStarts(source) {
  const ltr = [];
  let previousWasBlank = true;

  for (const entry of sourceLines(source)) {
    if (entry.inFence) {
      if (entry.closingFence) previousWasBlank = true;
      continue;
    }

    const trimmed = entry.line.trim();
    if (!trimmed) {
      previousWasBlank = true;
      continue;
    }

    const quote = splitBlockQuotePrefix(entry.line);
    const markedBlock = quote.body.match(
      /^\s*(?:(?:[-*+]\s+)|(?:[0-9۰-۹]+\.\s+)|(?:#{1,6}\s+))(.+)$/u,
    );
    let content = markedBlock?.[1]?.trim() ?? (quote.depth > 0 ? quote.body.trim() : null);
    const blockProbe = quote.body.trim();
    if (
      !content
      && previousWasBlank
      && !/^(?:<|!\[|\||-{3,}$|\[[^\]]+\]:)/u.test(blockProbe)
    ) {
      content = trimmed;
    }

    if (content) {
      const visibleStart = content.replace(/^[*_~`]+/u, '');
      const firstStrong = [...visibleStart].find((character) => STRONG_CHARACTER.test(character));
      if (firstStrong && LATIN_CHARACTER.test(firstStrong)) ltr.push(entry.lineNumber);
    }
    previousWasBlank = false;
  }

  return { ltr };
}

function decodeHtmlEntities(value) {
  const named = new Map([
    ['amp', '&'],
    ['apos', "'"],
    ['gt', '>'],
    ['lt', '<'],
    ['nbsp', ' '],
    ['quot', '"'],
    ['zwnj', '\u200c'],
    ['zwj', '\u200d'],
  ]);
  return value.replace(/&(#(?:x[0-9a-f]+|[0-9]+)|[a-z]+);/giu, (entity, key) => {
    if (key[0] !== '#') return named.get(key.toLowerCase()) ?? entity;
    const hexadecimal = key[1]?.toLowerCase() === 'x';
    const codePoint = Number.parseInt(key.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
    try {
      return String.fromCodePoint(codePoint);
    } catch {
      return entity;
    }
  });
}

function replaceInlineCode(value) {
  return value.replace(/(`+)(.*?)\1/gu, (_match, _marker, content) => {
    const collapsed = content.replace(/[ \t]+/gu, ' ');
    if (/^ .* $/u.test(collapsed) && !/^ +$/u.test(collapsed)) return collapsed.slice(1, -1);
    return collapsed;
  });
}

export function visibleHeadingText(markdown) {
  let value = markdown;
  value = replaceInlineCode(value);
  value = value.replace(/!?\[([^\]\r\n]*)\]\([^)]*\)/gu, '$1');
  value = value.replace(/!?\[([^\]\r\n]*)\]\[[^\]\r\n]*\]/gu, '$1');
  value = value.replace(/<[^>]+>/gu, '');
  for (const delimiter of ['**', '__', '~~', '*', '_']) {
    const escaped = delimiter.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
    value = value.replace(new RegExp(`${escaped}(.+?)${escaped}`, 'gu'), '$1');
  }
  return decodeHtmlEntities(value);
}

export function githubHeadingSlug(markdown) {
  const visible = visibleHeadingText(markdown).toLowerCase();
  const retained = [...visible].filter((character) => (
    character === ' '
    || character === '-'
    || character === '_'
    || character === '\u200c'
    || character === '\u200d'
    || SLUG_CHARACTER.test(character)
  ));
  return retained.join('').replace(/ /gu, '-');
}

function extractHeading(line) {
  const match = line.match(/^ {0,3}(#{1,6})(?:[ \t]+(.+?)|[ \t]*)$/u);
  if (!match || !match[2]) return null;
  const markdown = match[2].replace(/[ \t]+#+[ \t]*$/u, '').trimEnd();
  return { markdown, text: visibleHeadingText(markdown) };
}

function maskInlineCode(line) {
  return line.replace(/(`+)(.*?)\1/gu, (match) => ' '.repeat(match.length));
}

function decodeFragment(fragment) {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
}

export function validateInternalAnchors(source) {
  const headings = [];
  const links = [];
  const occupied = new Set();
  const nextSuffix = new Map();
  let nearestHeading = null;

  for (const entry of sourceLines(source)) {
    if (entry.inFence) continue;

    const heading = extractHeading(entry.line);
    if (heading) {
      const base = githubHeadingSlug(heading.markdown);
      let slug = base;
      let suffix = nextSuffix.get(base) ?? 0;
      while (occupied.has(slug)) {
        suffix += 1;
        slug = `${base}-${suffix}`;
      }
      nextSuffix.set(base, suffix);
      occupied.add(slug);
      nearestHeading = heading.text;
      headings.push({ line: entry.lineNumber, slug, text: heading.text });
    }

    const linkSource = maskInlineCode(entry.line);
    const linkPattern = /\[[^\]\r\n]*\]\(\s*(#[^\s)]+)(?:\s+[^)]*)?\)/gu;
    for (const match of linkSource.matchAll(linkPattern)) {
      const fragment = match[1];
      links.push({
        fragment,
        line: entry.lineNumber,
        nearestHeading: nearestHeading ?? '(document start)',
        target: decodeFragment(fragment.slice(1)),
      });
    }
  }

  const mismatches = links
    .filter((link) => !occupied.has(link.target))
    .map(({ fragment, line, nearestHeading }) => ({ fragment, line, nearestHeading }));

  return { headings, links, mismatches };
}

function formatLines(lines) {
  return lines.length > 0 ? lines.join(', ') : 'none';
}

function runCli() {
  const sourcePath = resolve(process.argv[2] ?? 'README.md');
  const source = readFileSync(sourcePath, 'utf8');
  const unsafe = findUnsafeGitHubBlockStarts(source);
  const anchors = validateInternalAnchors(source);
  let failed = false;

  if (unsafe.ltr.length > 0) {
    console.error(`Latin-directed prose blocks: ${formatLines(unsafe.ltr)}`);
    failed = true;
  }
  if (anchors.mismatches.length > 0) {
    console.error('Internal anchor mismatches:');
    for (const mismatch of anchors.mismatches) {
      console.error(
        `line ${mismatch.line}: fragment "${mismatch.fragment}" (nearest heading: "${mismatch.nearestHeading}")`,
      );
    }
    failed = true;
  }
  if (failed) {
    process.exitCode = 1;
    return;
  }

  console.log(
    `README source QA passed: RTL block starts, ${anchors.headings.length} headings, and ${anchors.links.length} internal links.`,
  );
}

const invokedModule = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (import.meta.url === invokedModule) runCli();
