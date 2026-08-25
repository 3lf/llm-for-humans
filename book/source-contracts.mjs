const MODEL_TABLE_HEADER = '| مدل | ارائه‌دهنده | نوع | کانتکست | چندوجهی | فارسی | نکته کلیدی |';
export const additionalMixedDirectionTokens = ['Persian-Phi'];

export function extractModelContextTokens(source) {
  const tableStart = source.indexOf(MODEL_TABLE_HEADER);
  if (tableStart < 0) throw new Error('Model snapshot table is missing.');
  const tableEnd = source.indexOf('\n\n', tableStart);
  const table = source.slice(tableStart, tableEnd < 0 ? source.length : tableEnd);
  const rows = table.split(/\r?\n/u).slice(2).filter((line) => line.startsWith('|'));
  const tokens = rows.flatMap((row) => {
    const context = row.split('|')[4]?.trim() ?? '';
    return [...context.matchAll(/[0-9]+(?:\.[0-9]+)?[MK]/gu)].map((match) => match[0]);
  });
  if (tokens.length === 0) throw new Error('Model snapshot table has no context tokens.');
  return [...new Set(tokens)];
}

export function configuredSourceSelectors(config) {
  return [
    ...(config.images?.classRules ?? []).map((rule) => ({ ...rule, selector: rule.endsWith, sourceForm: 'literal' })),
    ...(config.contentRules?.calloutClassRules ?? []).map((rule) => ({ ...rule, selector: rule.contains, sourceForm: 'literal' })),
    ...(config.contentRules?.paragraphClassRules ?? []).map((rule) => ({ ...rule, selector: rule.startsWith, sourceForm: 'visible-text' })),
    ...(config.contentRules?.chapterClassRules ?? []).map((rule) => ({ ...rule, selector: rule.titleStartsWith, sourceForm: 'h1' })),
  ];
}
