const LOCALE = 'en-US'

// Parse 'YYYY-MM-DD' (or 'YYYY-MM') as a local date, not UTC.
export function formatDate(dateStr, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m) return dateStr
  return new Date(y, m - 1, d || 1).toLocaleDateString(LOCALE, options)
}

export function formatNumber(n) {
  return (Number(n) || 0).toLocaleString(LOCALE, { maximumFractionDigits: 1 })
}
