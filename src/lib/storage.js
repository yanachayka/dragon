// localStorage persistence. Seeds the demo data once, on the first run only.

import { rangeDays } from './dates.js'

const KEY = 'habit-streak/v1'

export function seedState() {
  return {
    habit: { name: 'Читати 20 хвилин', startDate: '2026-03-12' },
    // 24 March is deliberately absent — it is the gap that breaks the streak.
    marks: [...rangeDays('2026-03-12', '2026-03-23'), ...rangeDays('2026-03-25', '2026-03-28')],
  }
}

function isValid(value) {
  return (
    value &&
    typeof value === 'object' &&
    value.habit &&
    typeof value.habit.name === 'string' &&
    typeof value.habit.startDate === 'string' &&
    Array.isArray(value.marks)
  )
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (isValid(parsed)) return parsed
    }
  } catch {
    // Unreadable or unavailable storage falls through to the seed.
  }
  const seeded = seedState()
  saveState(seeded)
  return seeded
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Private mode / quota — the session still works, it just will not persist.
  }
}
