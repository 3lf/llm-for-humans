import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  fullCalendarMonthsBetween,
  readerVisibleSnapshotLabel,
  validateVolatileData,
} from './volatile-data.mjs';

const bookDirectory = path.dirname(fileURLToPath(import.meta.url));
const readme = fs.readFileSync(path.join(bookDirectory, '..', 'README.md'), 'utf8');
const juneSnapshot = '<!-- volatile-data-reviewed: 2026-06 -->\n'
  + 'خرداد ۱۴۰۵ (ژوئن ۲۰۲۶)\n'.repeat(3);

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

test('reader-visible labels are derived from the marker month', () => {
  assert.equal(
    readerVisibleSnapshotLabel({ year: 2026, month: 6 }),
    'خرداد ۱۴۰۵ (ژوئن ۲۰۲۶)',
  );
});
