import { useState } from 'react'
import { TODAY } from '../today.js'
import { currentStreak, longestStreak } from '../lib/stats.js'
import { days } from '../lib/plural.js'

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-[72px] w-[72px]" aria-hidden="true">
      <path
        d="M4 12.5 L9.5 18 L20 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** The one line under the streak. Soft when the streak is gone — no blame. */
function statusLine(streak, record) {
  if (streak === 0) return 'Серія обнулилась. Починаємо заново, сьогодні день 1'
  const left = record - streak
  if (left <= 0) return 'Це твій новий рекорд'
  return `Ще ${left} ${days(left)} до особистого рекорду`
}

export default function TodayScreen({ habit, marks, onMarkToday }) {
  const [pop, setPop] = useState(false)
  const doneToday = marks.has(TODAY)
  const streak = currentStreak(marks, TODAY)
  const record = longestStreak(marks)

  const handleMark = () => {
    if (doneToday) return
    onMarkToday(TODAY)
    // Absent on iOS Safari — there the animation is the whole feedback.
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(15)
    }
    setPop(true)
    window.setTimeout(() => setPop(false), 240)
  }

  return (
    <div className="flex min-h-[calc(100dvh-192px)] flex-col items-center justify-center">
      <h1 className="display w-full text-center text-[32px] leading-none">{habit.name}</h1>

      <button
        type="button"
        onClick={handleMark}
        aria-disabled={doneToday}
        aria-label={doneToday ? 'Сьогодні зроблено' : 'Зроблено'}
        style={{ width: 'min(56vw, 220px)', height: 'min(56vw, 220px)' }}
        className={`mt-10 flex flex-col items-center justify-center gap-1 rounded-pill bg-ember text-obsidian ${
          pop ? 'press-pop' : ''
        }`}
      >
        {doneToday ? (
          <>
            <Check />
            <span className="text-[14px] leading-tight">Сьогодні зроблено</span>
          </>
        ) : (
          <span className="display text-[32px] leading-none">Зроблено</span>
        )}
      </button>

      <p className="display mt-10 text-[96px] leading-[0.95]">{streak}</p>
      <p className="mt-1 text-[16px] leading-none">{`${days(streak)} поспіль`}</p>

      <p className="mt-6 max-w-[300px] text-center text-[16px] leading-snug">
        {statusLine(streak, record)}
      </p>
    </div>
  )
}
