// filters: [{field, mode: 'include'|'exclude', values: []}, ...]
export function applyFilters(data, filters){
  if (!filters || filters.length === 0) return data;
  return data.filter(row => {
    for (const f of filters){
      const v = row[f.field];
      const check = f.values.includes(String(v));
      if (f.mode === 'include' && !check) return false;
      if (f.mode === 'exclude' && check) return false;
    }
    return true;
  });
}
