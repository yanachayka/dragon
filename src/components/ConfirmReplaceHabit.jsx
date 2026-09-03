import { useEffect, useRef, useState } from 'react'

/**
 * Confirmation for «Змінити звичку». Says plainly that the history is erased.
 * Cancel is the default action: it takes focus, and Escape or a tap outside
 * closes the dialog without changing anything.
 */
export default function ConfirmReplaceHabit({ currentName, onCancel, onConfirm }) {
  const [name, setName] = useState(currentName)
  const cancelRef = useRef(null)

  useEffect(() => {
    cancelRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  const trimmed = name.trim()

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-obsidian/40 px-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="replace-habit-title"
        className="w-full max-w-[448px] rounded-card bg-limestone p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="replace-habit-title" className="display text-[32px] leading-none">
          Змінити звичку
        </h2>

        <p className="mt-4 text-[16px] leading-snug">
          Уся історія відміток буде стерта назавжди — усі відмічені дні, серія і статистика.
          Відлік почнеться сьогодні з нуля.
        </p>

        <hr className="divider-dotted my-6" />

        <label className="text-[14px] leading-none" htmlFor="new-habit-name">
          Нова звичка
        </label>
        <input
          id="new-habit-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          className="mt-3 w-full rounded-input border-[1.5px] border-obsidian bg-transparent px-6 py-4 text-[16px] outline-none"
        />

        {/* Cancel carries the primary weight — the destructive action is the quiet one. */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-pill bg-ember px-6 py-4 text-[16px] leading-none text-chalk"
          >
            Скасувати
          </button>
          <button
            type="button"
            disabled={!trimmed}
            onClick={() => onConfirm(trimmed)}
            className="rounded-[40px] border-[1.5px] border-obsidian bg-transparent px-6 py-4 text-[16px] leading-none disabled:opacity-40"
          >
            Стерти історію і почати заново
          </button>
        </div>
      </div>
    </div>
  )
}
