import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_BOOK_METADATA,
  formatReleaseMetadata,
  resolveBookMetadata,
} from './release-metadata.mjs';

test('formats the pipeline release date for the cover and colophon', () => {
  const metadata = formatReleaseMetadata({
    releaseVersion: 'v1.1.0-rc.1',
    releaseDate: '2026-08-02',
  });

  assert.deepEqual(metadata, {
    edition: 'ویرایش اول · ۱۱ مرداد ۱۴۰۵ · ISO 2026-08-02',
    localDate: '۱۱ مرداد ۱۴۰۵',
    latinDate: 'v1.1.0-rc.1 · ISO 2026-08-02',
    persianDate: '۱۱ مرداد ۱۴۰۵',
    gregorianDate: 'ISO 2026-08-02',
    releaseVersion: 'v1.1.0-rc.1',
    releaseDate: '2026-08-02',
    isRelease: true,
  });
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

test('keeps the committed edition metadata outside release builds', () => {
  assert.deepEqual(resolveBookMetadata({ env: {}, argv: ['node', 'config.mjs'] }), {
    ...DEFAULT_BOOK_METADATA,
  });
});

test('accepts the CLI release version when it matches the pipeline date', () => {
  const metadata = resolveBookMetadata({
    env: { README_PRESS_RELEASE_DATE: '2026-08-02' },
    argv: ['node', 'readme-press.mjs', 'pipeline', '--release-version', 'v1.1.0'],
  });
  assert.equal(metadata.releaseVersion, 'v1.1.0');
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
  assert.throws(
    () => formatReleaseMetadata({ releaseVersion: 'v1.1.0', releaseDate: '2026-02-29' }),
    /real Gregorian date/,
  );
});
