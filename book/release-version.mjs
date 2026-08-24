import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RELEASE_VERSION_PATTERN = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
const EDITION_LABELS = new Map([
  [1, 'ویرایش اول'],
  [2, 'ویرایش دوم'],
]);

export function parseReleaseVersion(value) {
  const match = RELEASE_VERSION_PATTERN.exec(value ?? '');
  if (!match) {
    throw new Error(
      `Invalid release version: ${value || '(missing)'}. Use vMAJOR.MINOR.PATCH[-prerelease] without leading zeros or build metadata.`,
    );
  }

  const prerelease = match[4] ?? null;
  const major = Number(match[1]);
  const editionLabel = EDITION_LABELS.get(major);
  if (!editionLabel) {
    throw new Error(`Unsupported release major version: ${major}. Add an explicit edition label before releasing it.`);
  }

  return Object.freeze({
    value,
    major,
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease,
    isPrerelease: prerelease !== null,
    editionLabel,
  });
}

function runCli() {
  if (process.argv.length !== 3) {
    throw new Error('Usage: node book/release-version.mjs vMAJOR.MINOR.PATCH[-prerelease]');
  }

  const release = parseReleaseVersion(process.argv[2]);
  console.log(`version=${release.value}`);
  console.log(`prerelease=${release.isPrerelease}`);
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  try {
    runCli();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
