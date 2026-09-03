export default function TabBar({ tabs, active, onSelect }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 flex justify-center px-4"
      style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}
      aria-label="Розділи"
    >
      <div className="flex w-full max-w-[448px] items-center gap-1 rounded-pill bg-limestone p-1.5">
        {tabs.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 rounded-pill px-2 py-3 text-[14px] leading-none transition-colors ${
                isActive ? 'bg-ember text-chalk' : 'bg-transparent text-obsidian'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
