export function topCounts(data, field, topN = 10){
  const m = new Map();
  for (const r of data){
    const k = String(r[field] ?? '');
    m.set(k, (m.get(k) || 0) + 1);
  }
  const arr = Array.from(m.entries()).map(([k,v]) => ({ value: k, count: v }));
  arr.sort((a,b) => b.count - a.count);
  return arr.slice(0, topN);
}
