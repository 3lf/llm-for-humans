import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import { buildContentInventory, resolveInventoryPaths } from './update-content-inventory.mjs';

function completeManifest() {
  return {
    requestedQuality: 'all',
    parts: [{ title: 'Part' }],
    chapters: [
      { subheadings: [{}, {}], tocHeadings: [{}] },
      { subheadings: [{}], tocHeadings: [{}, {}] },
    ],
    headings: 4,
    outputs: {
      normal: { pageCount: 10, html: 'normal.html' },
      print: { pageCount: 10, html: 'print.html' },
      high: { pageCount: 10, html: 'high.html' },
    },
    optimizedFigures: [{}, {}],
    highQualityFigures: [{}, {}],
  };
}

test('builds a strict inventory from a complete three-edition manifest', () => {
  const html = [
    '<aside class="callout callout-note"></aside>',
    '<aside class="callout callout-note"></aside>',
    '<aside class="callout callout-tip"></aside>',
  ].join('\n');
  assert.deepEqual(buildContentInventory(completeManifest(), html), {
    schemaVersion: 1,
    parts: 1,
    chapters: 2,
    headings: 4,
    subheadings: 3,
    tocEntries: 3,
    pages: { normal: 10, print: 10, high: 10 },
    figures: 2,
    callouts: { total: 3, byKind: { note: 2, tip: 1 } },
  });
});

test('refuses incomplete manifests', () => {
  const manifest = completeManifest();
  delete manifest.outputs.print;
  assert.throws(
    () => buildContentInventory(manifest, '<aside class="callout callout-note"></aside>'),
    /print output is incomplete/u,
  );

  const singleEdition = completeManifest();
  singleEdition.requestedQuality = 'normal';
  assert.throws(
    () => buildContentInventory(singleEdition, '<aside class="callout callout-note"></aside>'),
    /requestedQuality must be all/u,
  );
});

test('resolves default inventory paths from the book module, not the caller directory', () => {
  assert.deepEqual(resolveInventoryPaths([], '/repo/book'), {
    manifestPath: '/repo/book/dist/manifest.json',
    candidatePath: '/repo/book/content-inventory.candidate.json',
  });
});

test('CLI writes only an inventory candidate after validation', () => {
  const directory = mkdtempSync(join(tmpdir(), 'content-inventory-'));
  const manifestPath = join(directory, 'manifest.json');
  const htmlPath = join(directory, 'normal.html');
  const candidatePath = join(directory, 'content-inventory.candidate.json');
  try {
    writeFileSync(manifestPath, JSON.stringify(completeManifest()), 'utf8');
    writeFileSync(htmlPath, '<aside class="callout callout-note"></aside>', 'utf8');
    const result = spawnSync(
      process.execPath,
      [join(import.meta.dirname, 'update-content-inventory.mjs'), manifestPath, candidatePath],
      { encoding: 'utf8' },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(readFileSync(candidatePath, 'utf8')).callouts.total, 1);

    const canonicalPath = join(directory, 'content-inventory.json');
    const rejected = spawnSync(
      process.execPath,
      [join(import.meta.dirname, 'update-content-inventory.mjs'), manifestPath, canonicalPath],
      { encoding: 'utf8' },
    );
    assert.equal(rejected.status, 1);
    assert.match(rejected.stderr, /writes only a reviewed \*\.candidate\.json/u);
    assert.equal(existsSync(canonicalPath), false);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
