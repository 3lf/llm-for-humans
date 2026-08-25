import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { toJalaali } from 'jalaali-js';

const MARKER_PATTERN = /<!-- volatile-data-reviewed: (\d{4})-(\d{2}) -->/g;
const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];
const GREGORIAN_MONTHS = [
  'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
  'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر',
];
const CONTEXT_TABLE_HEADER = '| مدل | پنجره کانتکست | تقریباً چند صفحه کتاب؟ |';
const CONTEXT_QUALIFIER_PATTERN = /(?:^|\s)(?:حدود|تا)(?:\s|$)/u;

function toPersianDigits(value) {
  return String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
}

export function fullCalendarMonthsBetween(reviewedMonth, now) {
  // The workflow runs well after midnight UTC. UTC keeps the calculation
  // deterministic across developer machines without creating a practical
  // Iran-time boundary gap for the scheduled check.
  const reviewedIndex = reviewedMonth.year * 12 + reviewedMonth.month - 1;
  const currentIndex = now.getUTCFullYear() * 12 + now.getUTCMonth();
  return currentIndex - reviewedIndex;
}

export function extractContextWindowCells(source) {
  const lines = source.split(/\r?\n/u);
  const headerIndex = lines.findIndex((line) => line.trim() === CONTEXT_TABLE_HEADER);
  if (headerIndex === -1) {
    throw new Error('Could not find the model context-window table.');
  }

  const cells = [];
  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.trim().startsWith('|')) break;
    const columns = line.split('|').slice(1, -1).map((column) => column.trim());
    if (columns.length !== 3 || !columns[1]) {
      throw new Error(`Malformed model context-window row: ${line.trim()}`);
    }
    cells.push(columns[1]);
  }

  if (cells.length === 0) {
    throw new Error('The model context-window table has no data rows.');
  }
  return cells;
}

export function readerVisibleSnapshotLabel({ year, month }) {
  const { jy, jm } = toJalaali(year, month, 15);
  return `${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)} (${GREGORIAN_MONTHS[month - 1]} ${toPersianDigits(year)})`;
}

export function validateVolatileData(source, now = new Date()) {
  const markers = [...source.matchAll(MARKER_PATTERN)];
  if (markers.length !== 1) {
    throw new Error(`Expected exactly one volatile-data marker; found ${markers.length}.`);
  }

  const year = Number(markers[0][1]);
  const month = Number(markers[0][2]);
  if (month < 1 || month > 12) {
    throw new Error(`Invalid volatile-data month: ${markers[0][1]}-${markers[0][2]}.`);
  }

  const reviewedMonth = { year, month };
  const ageInMonths = fullCalendarMonthsBetween(reviewedMonth, now);
  if (ageInMonths < 0) {
    throw new Error('The volatile-data review month cannot be in the future.');
  }
  if (ageInMonths > 4) {
    throw new Error(`Volatile data is ${ageInMonths} full calendar months old; refresh it before it exceeds 4 months.`);
  }

  const expectedLabel = readerVisibleSnapshotLabel(reviewedMonth);
  const visibleOccurrences = source.split(expectedLabel).length - 1;
  if (visibleOccurrences !== 3) {
    throw new Error(`Expected all 3 reader-visible snapshot dates to be "${expectedLabel}"; found ${visibleOccurrences}.`);
  }

  const qualifiedContextCells = extractContextWindowCells(source)
    .filter((cell) => CONTEXT_QUALIFIER_PATTERN.test(cell));
  if (qualifiedContextCells.length > 0) {
    throw new Error(`Move context-window qualifiers to the table note: ${qualifiedContextCells.join(', ')}.`);
  }

  return { reviewedMonth, ageInMonths, expectedLabel };
}

function runCli() {
  const sourcePath = process.argv[2];
  if (!sourcePath || process.argv.length !== 3) {
    throw new Error('Usage: node book/volatile-data.mjs README.md');
  }

  const source = fs.readFileSync(sourcePath, 'utf8');
  const result = validateVolatileData(source);
  console.log(`Volatile data is current: ${result.expectedLabel} (${result.ageInMonths} calendar months old).`);
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
