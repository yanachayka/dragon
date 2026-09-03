import { useState } from 'react'
import { TODAY } from '../today.js'
import { completionRate, last30Days, longestStreak, totalDays } from '../lib/stats.js'
import { formatDayMonth } from '../lib/dates.js'
import ConfirmReplaceHabit from '../components/ConfirmReplaceHabit.jsx'

/**
 * Stat Feature Card, shrunk for mobile: Ember surface, Chalk text, 16px padding
 * so three of them hold one row at 375px without the numbers overflowing.
 * The «%» is set at half size — that keeps the digits at 48px and up.
 */
function StatCard({ label, value, suffix }) {
  return (
    <div className="flex min-w-0 flex-col justify-between rounded-card bg-ember p-4 text-chalk min-[400px]:p-6">
      <p className="text-[14px] leading-tight">{label}</p>
      <p className="display mt-4 text-[48px] leading-[1.1] min-[400px]:text-[56px] min-[430px]:text-[64px]">
        {value}
        {suffix && <span className="text-[0.5em]">{suffix}</span>}
      </p>
    </div>
  )
}

export default function StatsScreen({ habit, marks, onReplaceHabit }) {
  const [confirming, setConfirming] = useState(false)
  const recent = last30Days(marks, TODAY)

  return (
    <div>
      <h1 className="display text-[32px] leading-none">Статистика</h1>

      <div className="mt-6 grid grid-cols-3 items-stretch gap-2">
        <StatCard label="Найдовша серія" value={longestStreak(marks)} />
        <StatCard label="Усього днів" value={totalDays(marks)} />
        <StatCard
          label="Виконано"
          value={completionRate(marks, habit.startDate, TODAY)}
          suffix="%"
        />
      </div>

      <div className="mt-4 rounded-card bg-limestone p-6">
        <p className="text-[14px] leading-none">Останні 30 днів</p>
        <div className="mt-4 flex gap-[2px]">
          {recent.map((day) => (
            <div
              key={day.date}
              title={formatDayMonth(day.date)}
              className={`aspect-square min-w-0 flex-1 rounded-[3px] ${
                day.marked ? 'bg-ember' : 'border-[1.5px] border-obsidian bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      <hr className="divider-dotted my-6" />

      <p className="meta">{`Почато ${formatDayMonth(habit.startDate)}`}</p>

      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="mt-6 w-full rounded-[40px] border-[1.5px] border-obsidian bg-transparent px-6 py-4 text-[16px] leading-none"
      >
        Змінити звичку
      </button>

      {confirming && (
        <ConfirmReplaceHabit
          currentName={habit.name}
          onCancel={() => setConfirming(false)}
          onConfirm={(name) => {
            setConfirming(false)
            onReplaceHabit(name)
          }}
        />
      )}
    </div>
  )
}
