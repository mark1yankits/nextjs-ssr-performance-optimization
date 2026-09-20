# Frontend

Next.js (App Router, TypeScript) — SSR/ISR/streaming демо, backend: Express API
(`../backend`, http://localhost:4000).

## Запуск

```bash
cp .env.example .env
npm install
npm run dev
```

Відкрити http://localhost:3000. Переконайтеся, що backend запущений (`../backend`,
`npm run dev`) — сторінки звертаються до нього під час рендерингу.

## Структура

- `src/lib/api.ts` — обгортка над `fetch` для звернень до backend API: базовий URL
  (`BACKEND_API_URL`), таймаут запиту, нормалізація помилок (`ApiError`). Кешування
  (`cache`/`next.revalidate`) налаштовується окремо для кожного виклику на сторінці.
- `src/lib/types.ts` — типи даних (`Article`, `ArticleListItem`, `ArticleListResponse`),
  що відповідають формату відповідей backend API.
- `src/components/ArticleList.tsx` — презентаційний список статей, спільний для
  SSR/ISR/streaming сторінок.

## Сторінки-демо

- `/ssr` — **SSR**: `export const dynamic = "force-dynamic"` + `fetch(..., { cache: "no-store" })`,
  рендериться заново при кожному запиті (час рендерингу на сторінці змінюється при кожному
  оновленні). Помилки API та таймаут (5с, див. `fetchApi`) обробляються без падіння сторінки —
  показується повідомлення про помилку; `error.tsx` ловить неочікувані винятки.
