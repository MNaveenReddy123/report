export function fmtNumber(n){
  if (n === null || n === undefined) return '-';
  return Intl.NumberFormat('en-US').format(n);
}
export function fmtCurrency(n){
  if (n === null || n === undefined) return '-';
  return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
}
