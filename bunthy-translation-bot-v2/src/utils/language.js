function normalizeLanguageCode(code) {
  if (!code) return '';
  const value = String(code).trim().toLowerCase().replace('_', '-');
  return value === 'zh' ? 'zh-cn' : value;
}

function languagesMatch(a, b) {
  const first = normalizeLanguageCode(a);
  const second = normalizeLanguageCode(b);
  if (!first || !second) return false;
  if (first === second) return true;
  if (first.startsWith('zh') && second.startsWith('zh')) return true;
  return first.split('-')[0] === second.split('-')[0];
}

function detectedFromGoogle(result) {
  return result?.raw?.src || result?.from?.language?.iso || null;
}

module.exports = { normalizeLanguageCode, languagesMatch, detectedFromGoogle };
