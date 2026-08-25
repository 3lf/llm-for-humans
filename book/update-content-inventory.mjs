import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { countHtmlCallouts } from './qa-helpers.mjs';

export const REQUIRED_EDITIONS = ['normal', 'print', 'high'];
const CALLOUT_KIND_ORDER = ['note', 'tip', 'warn', 'date', 'new', 'star'];
const bookDirectory = dirname(fileURLToPath(import.meta.url));

function requireArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Complete manifest is required: ${label} is missing or empty.`);
  }
  return value;
}

function orderedCalloutInventory(html) {
  const callouts = countHtmlCallouts(html);
  const counts = callouts.byKind;
  const knownKinds = CALLOUT_KIND_ORDER.filter((kind) => counts[kind] !== undefined);
  const extraKinds = Object.keys(counts)
    .filter((kind) => !CALLOUT_KIND_ORDER.includes(kind))
    .sort();
  const byKind = Object.fromEntries(
    [...knownKinds, ...extraKinds].map((kind) => [kind, counts[kind]]),
  );
  return {
    total: callouts.total,
    byKind,
  };
}

export function buildContentInventory(manifest, html) {
  if (manifest.requestedQuality !== 'all') {
    throw new Error('Complete manifest is required: requestedQuality must be all.');
  }
  const parts = requireArray(manifest.parts, 'parts');
  const chapters = requireArray(manifest.chapters, 'chapters');
  const optimizedFigures = requireArray(manifest.optimizedFigures, 'optimizedFigures');
  const highQualityFigures = requireArray(manifest.highQualityFigures, 'highQualityFigures');
  if (!Number.isInteger(manifest.headings)) {
    throw new Error('Complete manifest is required: headings is missing.');
  }
  if (typeof html !== 'string' || html.length === 0) {
    throw new Error('Complete manifest is required: normal edition HTML is unavailable.');
  }

  const pages = {};
  for (const edition of REQUIRED_EDITIONS) {
    const output = manifest.outputs?.[edition];
    if (!output || !Number.isInteger(output.pageCount) || typeof output.html !== 'string') {
      throw new Error(`Complete manifest is required: ${edition} output is incomplete.`);
    }
    pages[edition] = output.pageCount;
  }
  if (optimizedFigures.length !== highQualityFigures.length) {
    throw new Error('Complete manifest is required: figure catalogs disagree.');
  }

  const subheadings = chapters.reduce(
    (sum, chapter) => sum + (chapter.subheadings?.length ?? 0),
    0,
  );
  const tocEntries = chapters.reduce(
    (sum, chapter) => sum + (chapter.tocHeadings?.length ?? 0),
    0,
  );

  return {
    schemaVersion: 1,
    parts: parts.length,
    chapters: chapters.length,
    headings: manifest.headings,
    subheadings,
    tocEntries,
    pages,
    figures: optimizedFigures.length,
    callouts: orderedCalloutInventory(html),
  };
}

export function resolveInventoryPaths(argv, baseDirectory = bookDirectory) {
  return {
    manifestPath: resolve(argv[0] ?? resolve(baseDirectory, 'dist/manifest.json')),
    candidatePath: resolve(argv[1] ?? resolve(baseDirectory, 'content-inventory.candidate.json')),
  };
}

function runCli() {
  const { manifestPath, candidatePath } = resolveInventoryPaths(process.argv.slice(2));
  if (!basename(candidatePath).endsWith('.candidate.json')) {
    throw new Error('Inventory updater writes only a reviewed *.candidate.json file.');
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  for (const edition of REQUIRED_EDITIONS) {
    if (!manifest.outputs?.[edition]) {
      throw new Error(`Complete manifest is required: ${edition} output is missing.`);
    }
  }
  const normalHtmlPath = resolve(dirname(manifestPath), manifest.outputs.normal.html);
  const normalHtml = readFileSync(normalHtmlPath, 'utf8');
  const inventory = buildContentInventory(manifest, normalHtml);
  writeFileSync(candidatePath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');
  console.log(`Wrote inventory candidate: ${candidatePath}`);
  console.log('Review the candidate after visual QA; update the canonical inventory manually.');
}

const invokedModule = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (import.meta.url === invokedModule) runCli();
