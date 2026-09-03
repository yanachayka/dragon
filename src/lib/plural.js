// Ukrainian plural forms: 1 день · 2–4 дні · 5+ днів.

/** Picks one of [one, few, many] for `n`. */
export function plural(n, forms) {
  const abs = Math.abs(n)
  const mod10 = abs % 10
  const mod100 = abs % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

export const days = (n) => plural(n, ['день', 'дні', 'днів'])

/** «4 дні» */
export const daysWithCount = (n) => `${n} ${days(n)}`
