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

// Today's date as 'YYYY-MM-DD' in the local time zone (toISOString would give UTC).
export function todayLocal() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
