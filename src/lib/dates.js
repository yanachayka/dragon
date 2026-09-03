// Pure calendar arithmetic on ISO 'YYYY-MM-DD' strings.
// Deliberately implemented without the Date object: the app must have exactly
// one source of "now" (src/today.js), and civil-date math is timezone-free.

const pad2 = (n) => String(n).padStart(2, '0')

/** Days since 1970-01-01 for an ISO date (Howard Hinnant's days_from_civil). */
export function toEpochDay(iso) {
  const y = Number(iso.slice(0, 4))
  const m = Number(iso.slice(5, 7))
  const d = Number(iso.slice(8, 10))
  const yy = y - (m <= 2 ? 1 : 0)
  const era = Math.floor(yy / 400)
  const yoe = yy - era * 400
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy
  return era * 146097 + doe - 719468
}

/** Inverse of toEpochDay (civil_from_days). */
export function fromEpochDay(epochDay) {
  const z = epochDay + 719468
  const era = Math.floor(z / 146097)
  const doe = z - era * 146097
  const yoe = Math.floor(
    (doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365,
  )
  const y = yoe + era * 400
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100))
  const mp = Math.floor((5 * doy + 2) / 153)
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1
  const m = mp + (mp < 10 ? 3 : -9)
  return `${y + (m <= 2 ? 1 : 0)}-${pad2(m)}-${pad2(d)}`
}

export const addDays = (iso, n) => fromEpochDay(toEpochDay(iso) + n)

/** Whole days from `a` to `b` (positive when b is later). */
export const diffDays = (a, b) => toEpochDay(b) - toEpochDay(a)

/** Inclusive list of ISO dates from `from` to `to`. */
export function rangeDays(from, to) {
  const out = []
  for (let d = toEpochDay(from), end = toEpochDay(to); d <= end; d++) out.push(fromEpochDay(d))
  return out
}

export const year = (iso) => Number(iso.slice(0, 4))
export const month = (iso) => Number(iso.slice(5, 7))
export const dayOfMonth = (iso) => Number(iso.slice(8, 10))

export const isoOf = (y, m, d) => `${y}-${pad2(m)}-${pad2(d)}`

/** 0 = Monday … 6 = Sunday. 1970-01-01 was a Thursday (index 3). */
export const weekdayMonday0 = (iso) => (((toEpochDay(iso) + 3) % 7) + 7) % 7

export function daysInMonth(y, m) {
  const lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (m === 2 && (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0))) return 29
  return lengths[m - 1]
}

/** Shift a year/month pair by `n` months. */
export function shiftMonth(y, m, n) {
  const total = y * 12 + (m - 1) + n
  return { y: Math.floor(total / 12), m: (((total % 12) + 12) % 12) + 1 }
}

/**
 * Cells of a month grid, weeks starting Monday. Leading/trailing padding cells
 * are `null` so the grid never leaks days of the neighbouring months.
 */
export function monthGrid(y, m) {
  const lead = weekdayMonday0(isoOf(y, m, 1))
  const total = daysInMonth(y, m)
  const cells = Array(lead).fill(null)
  for (let d = 1; d <= total; d++) cells.push(isoOf(y, m, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export const MONTHS_NOMINATIVE = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
]

export const MONTHS_GENITIVE = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
]

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

/** «12 березня» */
export const formatDayMonth = (iso) => `${dayOfMonth(iso)} ${MONTHS_GENITIVE[month(iso) - 1]}`

/** «Березень 2026» */
export const formatMonthYear = (y, m) => `${MONTHS_NOMINATIVE[m - 1]} ${y}`
