// src/components/ExportCSV.js
export function exportToCSV(rows = [], filename = 'report.csv', columns = null) {
  // rows: array of objects
  // columns: optional array of { key: 'appBundle', label: 'App Bundle' } in the exact order you want
  if (!Array.isArray(rows) || rows.length === 0) {
    // still create a CSV with headers if columns provided
    if (!columns || columns.length === 0) {
      alert('No rows to export');
      return;
    }
  }

  // If columns not provided, build from first row keys (stable ordering via Object.keys)
  if (!columns || columns.length === 0) {
    const first = rows[0] || {};
    columns = Object.keys(first).map(k => ({ key: k, label: k }));
  }

  // Build CSV lines
  const headerLine = columns.map(col => `"${String(col.label).replace(/"/g,'""')}"`).join(',');
  const lines = [headerLine];

  for (const r of rows) {
    const rowParts = [];
    for (const col of columns) {
      let v = r ? r[col.key] : '';
      if (v === null || typeof v === 'undefined') {
        rowParts.push(''); // empty
        continue;
      }
      // If it's an object/array, stringify simply
      if (typeof v === 'object') {
        try {
          v = JSON.stringify(v);
        } catch (e) {
          v = String(v);
        }
      }
      // Ensure we convert to string and escape quotes
      const s = String(v).replace(/"/g, '""');
      rowParts.push(`"${s}"`);
    }
    lines.push(rowParts.join(','));
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
