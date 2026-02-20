export function calculateScore(matched, missing) {
  const total = matched.length + missing.length;
  if (total === 0) return 0;

  return Math.round((matched.length / total) * 100);
}
