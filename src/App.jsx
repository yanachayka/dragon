import { useEffect, useMemo, useState } from 'react'
import { TODAY } from './today.js'
import { loadState, saveState } from './lib/storage.js'
import { diffDays } from './lib/dates.js'
import TodayScreen from './screens/TodayScreen.jsx'
import CalendarScreen from './screens/CalendarScreen.jsx'
import StatsScreen from './screens/StatsScreen.jsx'
import TabBar from './components/TabBar.jsx'

const TABS = [
  { id: 'today', label: 'Сьогодні' },
  { id: 'calendar', label: 'Календар' },
  { id: 'stats', label: 'Статистика' },
]

export default function App() {
  const [state, setState] = useState(loadState)
  const [tab, setTab] = useState('today')

  useEffect(() => {
    saveState(state)
  }, [state])

  const marks = useMemo(() => new Set(state.marks), [state.marks])

  /** Marking an already-marked day is a no-op; future days are inert. */
  const addMark = (date) => {
    if (diffDays(date, TODAY) < 0 || marks.has(date)) return
    setState((prev) => ({ ...prev, marks: [...prev.marks, date] }))
  }

  const toggleMark = (date) => {
    if (diffDays(date, TODAY) < 0) return
    setState((prev) =>
      marks.has(date)
        ? { ...prev, marks: prev.marks.filter((d) => d !== date) }
        : { ...prev, marks: [...prev.marks, date] },
    )
  }

  /** «Змінити звичку» — wipes the whole history and starts over from TODAY. */
  const replaceHabit = (name) => {
    setState({ habit: { name, startDate: TODAY }, marks: [] })
    setTab('today')
  }

  return (
    <div className="min-h-dvh bg-pumice">
      <main
        className="mx-auto w-full max-w-[480px] px-4 pt-8"
        style={{ paddingBottom: 'calc(128px + env(safe-area-inset-bottom))' }}
      >
        {tab === 'today' && <TodayScreen habit={state.habit} marks={marks} onMarkToday={addMark} />}
        {tab === 'calendar' && <CalendarScreen marks={marks} onToggle={toggleMark} />}
        {tab === 'stats' && (
          <StatsScreen habit={state.habit} marks={marks} onReplaceHabit={replaceHabit} />
        )}
      </main>
      <TabBar tabs={TABS} active={tab} onSelect={setTab} />
    </div>
  )
}
