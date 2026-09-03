# Habit Streak

Трекер однієї звички із серією днів. Три екрани: «Сьогодні», «Календар», «Статистика».
Vite + React + Tailwind v4, стан у localStorage, без бекенду.

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # чиста логіка (Vitest)
npm run build
```

## «Сьогодні» застосунку

Єдине джерело поточної дати — константа в [`src/today.js`](src/today.js):

```js
export const TODAY = '2026-03-29'
```

Демо-дата зафіксована так, щоб серія з тестових даних була жива: вчора зроблено,
сьогодні ще ні. Щоб перевести застосунок на реальну дату, змініть лише цей рядок:

```js
const now = new Date()
export const TODAY = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
```

Більше ніде в коді `new Date()` немає — календарна арифметика в `src/lib/dates.js`
працює з ISO-рядками напряму.

## Структура

| Файл | Що робить |
|------|-----------|
| `src/today.js` | константа `TODAY` |
| `src/lib/dates.js` | календарна арифметика, українські назви місяців і днів |
| `src/lib/stats.js` | чисті обчислення: серія, рекорд, усього, відсоток, останні 30 днів |
| `src/lib/plural.js` | українські форми множини (день · дні · днів) |
| `src/lib/storage.js` | localStorage і засів тестових даних при першому запуску |
| `src/screens/` | три екрани |
| `src/components/` | нижня панель і діалог підтвердження |

Щоб скинути дані до тестових: очистити localStorage і перезавантажити сторінку.
