import { toJalaali } from 'jalaali-js';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];
const RELEASE_VERSION = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const RELEASE_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export const DEFAULT_BOOK_METADATA = Object.freeze({
  edition: 'ویرایش اول · ۲۳ تیر ۱۴۰۵ · 14 July 2026',
  localDate: '۲۳ تیر ۱۴۰۵',
  latinDate: '14 July 2026',
  persianDate: '۲۳ تیر ۱۴۰۵',
  gregorianDate: '14 July 2026',
  releaseVersion: null,
  releaseDate: null,
  isRelease: false,
});

function toPersianDigits(value) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

function argumentValue(argv, name) {
  const inline = argv.find((argument) => argument.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
}

function parseGregorianDate(value) {
  const match = RELEASE_DATE.exec(value ?? '');
  if (!match) throw new Error(`Invalid README_PRESS_RELEASE_DATE: ${value ?? '(missing)'}. Use YYYY-MM-DD.`);
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid README_PRESS_RELEASE_DATE: ${value}. Use a real Gregorian date.`);
  }
  return { year, month, day, date };
}

export function formatReleaseMetadata({ releaseVersion, releaseDate }) {
  if (!RELEASE_VERSION.test(releaseVersion ?? '')) {
    throw new Error(`Invalid README_PRESS_RELEASE_VERSION: ${releaseVersion ?? '(missing)'}. Use vMAJOR.MINOR.PATCH.`);
  }
  const { year, month, day, date } = parseGregorianDate(releaseDate);
  const { jy, jm, jd } = toJalaali(year, month, day);
  const persianDate = `${toPersianDigits(jd)} ${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)}`;
  const gregorianDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

  return {
    edition: `ویرایش اول · ${persianDate} · ${gregorianDate}`,
    localDate: persianDate,
    latinDate: `${releaseVersion} · ${gregorianDate}`,
    persianDate,
    gregorianDate,
    releaseVersion,
    releaseDate,
    isRelease: true,
  };
}

export function resolveBookMetadata({ env = process.env, argv = process.argv } = {}) {
  const environmentVersion = env.README_PRESS_RELEASE_VERSION?.trim();
  const argumentVersion = argumentValue(argv, '--release-version')?.trim();
  if (environmentVersion && argumentVersion && environmentVersion !== argumentVersion) {
    throw new Error(
      `Release version mismatch: README_PRESS_RELEASE_VERSION is ${environmentVersion}, but --release-version is ${argumentVersion}.`,
    );
  }

  const releaseVersion = environmentVersion || argumentVersion;
  const releaseDate = env.README_PRESS_RELEASE_DATE?.trim();
  if (!releaseVersion && !releaseDate) return { ...DEFAULT_BOOK_METADATA };
  if (!releaseVersion) {
    throw new Error('README_PRESS_RELEASE_DATE requires README_PRESS_RELEASE_VERSION or --release-version.');
  }
  if (!releaseDate) {
    throw new Error('README_PRESS_RELEASE_DATE is required for a release PDF build.');
  }
  return formatReleaseMetadata({ releaseVersion, releaseDate });
}
