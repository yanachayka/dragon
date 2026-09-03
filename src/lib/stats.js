// All derived numbers in the app. Pure functions — no React, no clock, no storage.
// `marks` may be a Set or an array of ISO dates; `today` is always passed in.

import { addDays, diffDays, toEpochDay, fromEpochDay } from './dates.js'

const toSet = (marks) => (marks instanceof Set ? marks : new Set(marks))

/**
 * Consecutive marked days ending today. If today is not marked yet, a streak
 * that ends yesterday is still alive. 0 when neither today nor yesterday is marked.
 */
export function currentStreak(marks, today) {
  const set = toSet(marks)
  const yesterday = addDays(today, -1)
  const anchor = set.has(today) ? today : set.has(yesterday) ? yesterday : null
  if (!anchor) return 0
  let count = 0
  for (let day = anchor; set.has(day); day = addDays(day, -1)) count++
  return count
}

/** Longest run of consecutive marked days ever recorded. */
export function longestStreak(marks) {
  const set = toSet(marks)
  const sorted = [...set].map(toEpochDay).sort((a, b) => a - b)
  let best = 0
  let run = 0
  for (let i = 0; i < sorted.length; i++) {
    run = i > 0 && sorted[i] === sorted[i - 1] + 1 ? run + 1 : 1
    if (run > best) best = run
  }
  return best
}

/** Number of marked days. */
export const totalDays = (marks) => toSet(marks).size

/** Marked days as a percentage of the days from startDate to today, inclusive. */
export function completionRate(marks, startDate, today) {
  const span = diffDays(startDate, today) + 1
  if (span <= 0) return 0
  return Math.round((totalDays(marks) / span) * 100)
}

/** The 30 days ending today, oldest first: [{ date, marked }]. */
export function last30Days(marks, today) {
  const set = toSet(marks)
  const end = toEpochDay(today)
  const out = []
  for (let d = end - 29; d <= end; d++) {
    const date = fromEpochDay(d)
    out.push({ date, marked: set.has(date) })
  }
  return out
}
