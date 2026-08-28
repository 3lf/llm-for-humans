import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  extractContextWindowCells,
  fullCalendarMonthsBetween,
  readerVisibleSnapshotLabel,
  validateVolatileData,
} from './volatile-data.mjs';

const bookDirectory = path.dirname(fileURLToPath(import.meta.url));
const readme = fs.readFileSync(path.join(bookDirectory, '..', 'README.md'), 'utf8');
const juneSnapshot = '<!-- volatile-data-reviewed: 2026-06 -->\n'
  + 'خرداد ۱۴۰۵ (ژوئن ۲۰۲۶)\n'.repeat(3)
  + '| مدل | پنجره کانتکست | تقریباً چند صفحه کتاب؟ |\n'
  + '| :--- | :--- | :--- |\n'
  + '| مدل نمونه | 262K توکن | حدود ۴۰۰ صفحه |\n';

test('the README marker agrees with all three reader-visible snapshot dates', () => {
  assert.deepEqual(validateVolatileData(readme, new Date('2026-08-24T00:00:00Z')), {
    reviewedMonth: { year: 2026, month: 6 },
    ageInMonths: 2,
    expectedLabel: 'خرداد ۱۴۰۵ (ژوئن ۲۰۲۶)',
  });
});

test('four calendar months old is still accepted', () => {
  assert.equal(
    validateVolatileData(juneSnapshot, new Date('2026-10-31T23:59:59Z')).ageInMonths,
    4,
  );
});

test('five calendar months old is rejected at the next month boundary', () => {
  assert.throws(
    () => validateVolatileData(juneSnapshot, new Date('2026-11-01T00:00:00Z')),
    /5 full calendar months old/,
  );
});

test('the age calculation depends only on injected calendar months', () => {
  assert.equal(
    fullCalendarMonthsBetween({ year: 2026, month: 6 }, new Date('2026-10-01T00:00:00Z')),
    4,
  );
});

test('a mismatched reader-visible date is rejected', () => {
  assert.throws(
    () => validateVolatileData(juneSnapshot.replace('خرداد', 'تیر'), new Date('2026-08-24T00:00:00Z')),
    /all 3 reader-visible snapshot dates/,
  );
});

test('a missing marker is rejected', () => {
  assert.throws(
    () => validateVolatileData(juneSnapshot.replace('<!-- volatile-data-reviewed: 2026-06 -->\n', ''), new Date('2026-08-24T00:00:00Z')),
    /found 0/,
  );
});

test('duplicate markers are rejected', () => {
  assert.throws(
    () => validateVolatileData(`<!-- volatile-data-reviewed: 2026-06 -->\n${juneSnapshot}`, new Date('2026-08-24T00:00:00Z')),
    /found 2/,
  );
});

test('an invalid marker month is rejected', () => {
  assert.throws(
    () => validateVolatileData(juneSnapshot.replace('2026-06', '2026-13'), new Date('2026-08-24T00:00:00Z')),
    /Invalid volatile-data month/,
  );
});

test('a future marker month is rejected', () => {
  assert.throws(
    () => validateVolatileData(juneSnapshot.replace('2026-06', '2026-09'), new Date('2026-08-24T00:00:00Z')),
    /cannot be in the future/,
  );
});

test('context-window qualifiers must live in the table note', () => {
  assert.throws(
    () => validateVolatileData(juneSnapshot.replace('262K توکن', 'حدود 262K توکن'), new Date('2026-08-24T00:00:00Z')),
    /Move context-window qualifiers to the table note/,
  );
});

test('context-window cells are extracted from the snapshot table', () => {
  assert.deepEqual(extractContextWindowCells(readme), [
    '1M توکن',
    '1M توکن',
    '1M توکن',
    '10M توکن',
    '1M توکن',
    '262K توکن',
  ]);
});

test('reader-visible labels are derived from the marker month', () => {
  assert.equal(
    readerVisibleSnapshotLabel({ year: 2026, month: 6 }),
    'خرداد ۱۴۰۵ (ژوئن ۲۰۲۶)',
  );
});
