export function countHtmlCallouts(html) {
  const counts = {};
  let total = 0;

  for (const match of html.matchAll(/\sclass\s*=\s*(['"])(.*?)\1/gsu)) {
    const classes = match[2].split(/\s+/u).filter(Boolean);
    if (!classes.includes('callout')) continue;
    total += 1;
    for (const className of classes) {
      const kind = /^callout-([a-z]+)$/u.exec(className)?.[1];
      if (kind) counts[kind] = (counts[kind] ?? 0) + 1;
    }
  }

  return { total, byKind: counts };
}

export function sourceMatchDetail(source, matcher) {
  let index = -1;
  if (typeof matcher === 'string') {
    index = source.indexOf(matcher);
  } else {
    const flags = matcher.flags.replaceAll('g', '').replaceAll('y', '');
    index = new RegExp(matcher.source, flags).exec(source)?.index ?? -1;
  }
  if (index < 0) return null;

  const line = source.slice(0, index).split(/\r?\n/u).length;
  const lineStart = source.lastIndexOf('\n', index - 1) + 1;
  const lineEnd = source.indexOf('\n', index);
  const context = source.slice(lineStart, lineEnd < 0 ? source.length : lineEnd).trim();
  return `line ${line}: ${context}`;
}
