const LOCALE = 'en-US'

// Parse 'YYYY-MM-DD' as a local date (not UTC). Returns null for anything
// else, including out-of-range values like '2026-13-45' that Date would roll over.
export function parseLocalDate(dateStr) {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null
}

export function formatDate(dateStr, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
  const date = parseLocalDate(dateStr)
  if (!date) return typeof dateStr === 'string' ? dateStr : ''
  return date.toLocaleDateString(LOCALE, options)
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
