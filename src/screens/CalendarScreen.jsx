import { useState } from 'react'
import { TODAY } from '../today.js'
import {
  WEEKDAYS_SHORT,
  addDays,
  dayOfMonth,
  diffDays,
  formatMonthYear,
  month,
  monthGrid,
  shiftMonth,
  year,
} from '../lib/dates.js'

const CELL_GAP = 6

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d={dir === 'prev' ? 'M15 5 L8 12 L15 19' : 'M9 5 L16 12 L9 19'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function CalendarScreen({ marks, onToggle }) {
  const [view, setView] = useState({ y: year(TODAY), m: month(TODAY) })
  const cells = monthGrid(view.y, view.m)

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView(shiftMonth(view.y, view.m, -1))}
          aria-label="Попередній місяць"
          className="flex h-11 w-11 items-center justify-center rounded-pill border-[1.5px] border-obsidian"
        >
          <Chevron dir="prev" />
        </button>
        <h1 className="display text-[32px] leading-none">{formatMonthYear(view.y, view.m)}</h1>
        <button
          type="button"
          onClick={() => setView(shiftMonth(view.y, view.m, 1))}
          aria-label="Наступний місяць"
          className="flex h-11 w-11 items-center justify-center rounded-pill border-[1.5px] border-obsidian"
        >
          <Chevron dir="next" />
        </button>
      </div>

      <div className="mt-6 rounded-card bg-limestone p-6">
        <div className="grid grid-cols-7" style={{ gap: CELL_GAP }}>
          {WEEKDAYS_SHORT.map((name) => (
            <div key={name} className="meta pb-1 text-center opacity-60">
              {name}
            </div>
          ))}

          {cells.map((date, index) => {
            if (!date) return <div key={`pad-${index}`} />

            const marked = marks.has(date)
            const isFuture = diffDays(date, TODAY) < 0
            const isToday = date === TODAY
            // The chain only joins neighbours inside the same week row, so it
            // never wraps: the last column (index % 7 === 6) never draws one.
            const linked = marked && index % 7 !== 6 && marks.has(addDays(date, 1))

            return (
              <button
                key={date}
                type="button"
                disabled={isFuture}
                onClick={() => onToggle(date)}
                aria-pressed={marked}
                aria-label={`${dayOfMonth(date)} ${formatMonthYear(view.y, view.m)}`}
                className={`relative flex aspect-square items-center justify-center rounded-pill text-[14px] leading-none ${
                  marked
                    ? 'bg-ember text-chalk'
                    : 'border-[1.5px] border-obsidian bg-transparent text-obsidian'
                } ${isFuture ? 'opacity-30' : ''} ${
                  isToday && !marked ? 'border-[3px]' : ''
                }`}
              >
                {dayOfMonth(date)}
                {linked && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-full h-[1.5px] -translate-y-1/2 bg-ember"
                    style={{ width: CELL_GAP }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <p className="meta mt-6 text-center opacity-60">
        Тап по дню відмічає або знімає відмітку. Майбутні дні неактивні.
      </p>
    </div>
  )
}
