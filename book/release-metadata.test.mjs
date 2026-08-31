import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_BOOK_METADATA,
  formatReleaseMetadata,
  resolveBookMetadata,
} from './release-metadata.mjs';

test('formats a major-two prerelease for the cover and colophon', () => {
  const metadata = formatReleaseMetadata({
    releaseVersion: 'v2.1.0-rc.1',
    releaseDate: '2026-08-02',
  });

  assert.deepEqual(metadata, {
    edition: 'ویرایش دوم · ۱۱ مرداد ۱۴۰۵ · 2 August 2026',
    localDate: '۱۱ مرداد ۱۴۰۵',
    latinDate: 'v2.1.0-rc.1 · 2 August 2026',
    persianDate: '۱۱ مرداد ۱۴۰۵',
    gregorianDate: '2 August 2026',
    releaseVersion: 'v2.1.0-rc.1',
    releaseDate: '2026-08-02',
    isRelease: true,
  });
});

test('maps supported major versions to explicit edition labels', () => {
  assert.match(formatReleaseMetadata({
    releaseVersion: 'v1.9.0',
    releaseDate: '2026-08-02',
  }).edition, /^ویرایش اول ·/);
  assert.match(formatReleaseMetadata({
    releaseVersion: 'v2.0.0',
    releaseDate: '2026-08-02',
  }).edition, /^ویرایش دوم ·/);
  for (const releaseVersion of ['v0.1.0', 'v3.0.0']) {
    assert.throws(
      () => formatReleaseMetadata({ releaseVersion, releaseDate: '2026-08-02' }),
      /Unsupported release major version/,
    );
  }
});

test('converts Persian New Year boundaries with jalaali-js', () => {
  assert.equal(formatReleaseMetadata({
    releaseVersion: 'v1.0.0',
    releaseDate: '2026-03-20',
  }).persianDate, '۲۹ اسفند ۱۴۰۴');
  assert.equal(formatReleaseMetadata({
    releaseVersion: 'v1.0.0',
    releaseDate: '2026-03-21',
  }).persianDate, '۱ فروردین ۱۴۰۵');
  assert.equal(formatReleaseMetadata({
    releaseVersion: 'v1.0.0',
    releaseDate: '2025-03-20',
  }).persianDate, '۳۰ اسفند ۱۴۰۳');
});

test('accepts leap day and year-end without date rollover', () => {
  assert.equal(formatReleaseMetadata({
    releaseVersion: 'v1.0.0',
    releaseDate: '2028-02-29',
  }).gregorianDate, '29 February 2028');
  assert.equal(formatReleaseMetadata({
    releaseVersion: 'v1.0.0',
    releaseDate: '2026-12-31',
  }).gregorianDate, '31 December 2026');
});

test('keeps the committed edition metadata outside release builds', () => {
  assert.deepEqual(resolveBookMetadata({ env: {}, argv: ['node', 'config.mjs'] }), {
    ...DEFAULT_BOOK_METADATA,
  });
});

test('supports both release-version flag forms and lets the last duplicate win', () => {
  const inlineMetadata = resolveBookMetadata({
    env: { README_PRESS_RELEASE_DATE: '2026-08-02' },
    argv: ['node', 'readme-press.mjs', 'pipeline', '--release-version=v1.1.0'],
  });
  assert.equal(inlineMetadata.releaseVersion, 'v1.1.0');

  const duplicateMetadata = resolveBookMetadata({
    env: { README_PRESS_RELEASE_DATE: '2026-08-02' },
    argv: [
      'node', 'readme-press.mjs', 'pipeline',
      '--release-version', 'v1.1.0',
      '--release-version=v2.0.0-rc.1',
    ],
  });
  assert.equal(duplicateMetadata.releaseVersion, 'v2.0.0-rc.1');
  assert.match(duplicateMetadata.edition, /^ویرایش دوم ·/);
});

test('rejects empty or missing CLI release-version values clearly', () => {
  assert.throws(
    () => resolveBookMetadata({
      env: {},
      argv: ['node', 'readme-press.mjs', '--release-version='],
    }),
    /Empty value for --release-version/,
  );
  assert.throws(
    () => resolveBookMetadata({
      env: {},
      argv: ['node', 'readme-press.mjs', '--release-version', '--config', 'book/config.mjs'],
    }),
    /another flag cannot be used as its value/,
  );
  assert.throws(
    () => resolveBookMetadata({
      env: {},
      argv: ['node', 'readme-press.mjs', '--release-version'],
    }),
    /Missing value for --release-version/,
  );
});

test('rejects incomplete or conflicting pipeline metadata', () => {
  assert.throws(
    () => resolveBookMetadata({
      env: { README_PRESS_RELEASE_VERSION: 'v1.1.0' },
      argv: ['node', 'config.mjs'],
    }),
    /README_PRESS_RELEASE_DATE is required/,
  );
  assert.throws(
    () => resolveBookMetadata({
      env: { README_PRESS_RELEASE_DATE: '2026-08-02' },
      argv: ['node', 'config.mjs'],
    }),
    /requires README_PRESS_RELEASE_VERSION/,
  );
  assert.throws(
    () => resolveBookMetadata({
      env: {
        README_PRESS_RELEASE_VERSION: 'v1.1.0',
        README_PRESS_RELEASE_DATE: '2026-08-02',
      },
      argv: ['node', 'readme-press.mjs', 'pipeline', '--release-version', 'v2.0.0'],
    }),
    /Release version mismatch/,
  );
});

test('rejects invalid versions and impossible Gregorian dates', () => {
  assert.throws(
    () => formatReleaseMetadata({ releaseVersion: '1.1.0', releaseDate: '2026-08-02' }),
    /Invalid README_PRESS_RELEASE_VERSION/,
  );

  for (const releaseDate of [
    '2026-2-01',
    '2026-00-01',
    '2026-13-01',
    '2026-01-00',
    '2026-02-29',
    '2026-04-31',
  ]) {
    assert.throws(
      () => formatReleaseMetadata({ releaseVersion: 'v1.1.0', releaseDate }),
      /Invalid README_PRESS_RELEASE_DATE/,
    );
  }
});
