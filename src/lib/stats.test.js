import { describe, expect, it } from 'vitest'
import { currentStreak, longestStreak, totalDays, completionRate } from './stats.js'
import { seedState } from './storage.js'
import { TODAY } from '../today.js'

const seed = seedState()
const marks = new Set(seed.marks)

describe('seed data', () => {
  it('is the 12–23 + 25–28 March set the spec describes', () => {
    expect(marks.has('2026-03-23')).toBe(true)
    expect(marks.has('2026-03-24')).toBe(false)
    expect(marks.has('2026-03-25')).toBe(true)
  })
})

describe('longestStreak', () => {
  it('breaks at the 24 March gap, so the record is the 12 days before it', () => {
    expect(longestStreak(marks)).toBe(12)
  })
})

describe('currentStreak', () => {
  it('is alive at 4 when yesterday is marked and today is not', () => {
    expect(TODAY).toBe('2026-03-29')
    expect(marks.has(TODAY)).toBe(false)
    expect(marks.has('2026-03-28')).toBe(true)
    expect(currentStreak(marks, TODAY)).toBe(4)
  })

  it('counts today in once today is marked', () => {
    expect(currentStreak(new Set([...marks, TODAY]), TODAY)).toBe(5)
  })

  it('is 0 when neither today nor yesterday is marked', () => {
    expect(currentStreak(marks, '2026-03-31')).toBe(0)
  })

  it('restarts from 1 after a gap', () => {
    expect(currentStreak(marks, '2026-03-25')).toBe(1)
  })
})

describe('totals', () => {
  it('counts 16 marked days', () => {
    expect(totalDays(marks)).toBe(16)
  })

  it('is 89% of the 18 days from 12 to 29 March inclusive', () => {
    expect(completionRate(marks, seed.habit.startDate, TODAY)).toBe(89)
  })
})
