import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function findUnsafeGitHubBlockStarts(source) {
  const ltr = [];
  let inFence = false;
  let previousWasBlank = true;

  for (const [index, line] of source.split(/\r?\n/u).entries()) {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    const fenceProbe = trimmed.replace(/^>\s?/u, '');

    if (fenceProbe.startsWith('```')) {
      inFence = !inFence;
      previousWasBlank = false;
      continue;
    }
    if (inFence) continue;
    if (!trimmed) {
      previousWasBlank = true;
      continue;
    }

    const quoteBlock = line.match(/^\s*>\s?(.*)$/u);
    const blockBody = quoteBlock?.[1] ?? line;
    const markedBlock = blockBody.match(
      /^\s*(?:(?:[-*+]\s+)|(?:[0-9۰-۹]+\.\s+)|(?:#{1,6}\s+))(.+)$/u,
    );
    let content = markedBlock?.[1]?.trim() ?? quoteBlock?.[1]?.trim() ?? null;
    if (
      !content
      && previousWasBlank
      && !/^(?:<|!\[|\||-{3,}$|\[[^\]]+\]:)/u.test(trimmed)
    ) {
      content = trimmed;
    }

    if (content) {
      const visibleStart = content.replace(/^[*_~`]+/u, '');
      const firstStrong = [...visibleStart].find((character) => (
        /[\p{Script=Arabic}\p{Script=Latin}]/u.test(character)
      ));
      if (firstStrong && /\p{Script=Latin}/u.test(firstStrong)) ltr.push(lineNumber);
    }
    previousWasBlank = false;
  }

  return { ltr };
}

function formatLines(lines) {
  return lines.length > 0 ? lines.join(', ') : 'none';
}

function runCli() {
  const sourcePath = resolve(process.argv[2] ?? 'README.md');
  const source = readFileSync(sourcePath, 'utf8');
  const unsafe = findUnsafeGitHubBlockStarts(source);

  if (unsafe.ltr.length > 0) {
    console.error(`Latin-directed prose blocks: ${formatLines(unsafe.ltr)}`);
    process.exitCode = 1;
    return;
  }

  console.log('README RTL source QA passed: no prose block starts with Latin text.');
}

const invokedModule = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (import.meta.url === invokedModule) runCli();
