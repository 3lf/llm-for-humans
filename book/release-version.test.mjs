import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { parseReleaseVersion } from './release-version.mjs';

const bookDirectory = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.join(bookDirectory, 'release-version.mjs');

test('parses stable and prerelease versions into workflow metadata', () => {
  assert.deepEqual(parseReleaseVersion('v1.2.3'), {
    value: 'v1.2.3',
    major: 1,
    minor: 2,
    patch: 3,
    prerelease: null,
    isPrerelease: false,
    editionLabel: 'ویرایش اول',
  });
  assert.deepEqual(parseReleaseVersion('v2.0.0-rc.1'), {
    value: 'v2.0.0-rc.1',
    major: 2,
    minor: 0,
    patch: 0,
    prerelease: 'rc.1',
    isPrerelease: true,
    editionLabel: 'ویرایش دوم',
  });
});

test('preserves the intentionally narrow release-version wire format', () => {
  for (const releaseVersion of [
    '',
    '1.2.3',
    'V1.2.3',
    'v01.2.3',
    'v1.02.3',
    'v1.2.03',
    'v1.2.3-',
    'v1.2.3+build.4',
  ]) {
    assert.throws(
      () => parseReleaseVersion(releaseVersion),
      /Invalid release version/,
      releaseVersion,
    );
  }
});

test('rejects release majors without an explicit edition label', () => {
  for (const releaseVersion of ['v0.1.0', 'v3.0.0']) {
    assert.throws(
      () => parseReleaseVersion(releaseVersion),
      /Unsupported release major version/,
    );
  }
});

test('the dependency-free CLI emits GitHub step outputs', () => {
  const result = spawnSync(process.execPath, [cliPath, 'v2.4.0-beta.2'], {
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'version=v2.4.0-beta.2\nprerelease=true\n');
  assert.equal(result.stderr, '');
});

test('the CLI rejects a missing or invalid version', () => {
  const missing = spawnSync(process.execPath, [cliPath], { encoding: 'utf8' });
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /Usage:/);

  const invalid = spawnSync(process.execPath, [cliPath, 'V1.0.0'], { encoding: 'utf8' });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /Invalid release version/);
});
