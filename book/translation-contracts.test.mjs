import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  approvedTranslationPhrases,
  rejectedTranslationPatterns,
  unassignedTranslationIds,
} from './translation-contracts.mjs';

const source = readFileSync(join(import.meta.dirname, '..', 'README.md'), 'utf8');

test('preserves stable translation identifiers and their intentional gap', () => {
  const expectedAssigned = [
    ...Array.from({ length: 57 }, (_, index) => `TR-${String(index + 1).padStart(3, '0')}`),
    'TR-065',
  ];
  const expectedUnassigned = Array.from(
    { length: 7 },
    (_, index) => `TR-${String(index + 58).padStart(3, '0')}`,
  );
  assert.deepEqual(approvedTranslationPhrases.map(({ id }) => id), expectedAssigned);
  assert.deepEqual(unassignedTranslationIds, expectedUnassigned);
});

test('keeps translation phrases and labeled rejection rules source-correct', () => {
  for (const { id, phrase } of approvedTranslationPhrases) {
    assert.ok(source.includes(phrase), id);
  }
  assert.equal(
    new Set(rejectedTranslationPatterns.map(({ label }) => label)).size,
    rejectedTranslationPatterns.length,
  );
  for (const { label, pattern } of rejectedTranslationPatterns) {
    assert.ok(label.length > 0);
    assert.equal(pattern.test(source), false, label);
  }
});

test('keeps internal translation IDs out of the reader-facing glossary', () => {
  const glossary = source.slice(source.indexOf('# واژه‌نامه دوزبانه'));
  assert.match(glossary, /\| معادل فارسی \| اصطلاح انگلیسی \| توضیح کوتاه \|/u);
  assert.doesNotMatch(glossary, /TR-[0-9]{3}/u);
});
