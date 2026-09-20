# Backend

Express API на TypeScript.

## Запуск

```bash
cp .env.example .env   # вставити свій Neon DATABASE_URL
npm install
docker compose up -d redis   # з кореня репозиторію
npm run db:migrate
npm run db:seed              # 5000 тестових статей
npm run dev
```

Перевірка: `GET http://localhost:4000/health`

## База даних

- `src/db/migrations/*.sql` — SQL-міграції, застосовуються по черзі (`npm run db:migrate`),
  прогрес зберігається в таблиці `schema_migrations`.
- `src/db/seed.ts` — наповнює таблицю `articles` тестовими даними (`npm run db:seed`).
- Таблиця `articles` має індекс `idx_articles_published_at` для сортування/пагінації
  за датою публікації та унікальний індекс по `slug`.

## API

- `GET /api/articles?page=1&limit=20` — список статей, відсортований за `published_at DESC`.
  `limit` обмежено діапазоном 1–100. У відповіді немає поля `content` (вибираються тільки
  потрібні для списку поля), додатково повертаються `total`, `page`, `limit`, `totalPages`.
- `GET /api/articles/:slug` — повна стаття (з `content`) або `404`, якщо не знайдено.
- `POST /api/articles/:slug/view` — інкрементує `view_count` та інвалідує кеш цієї статті.

## Кешування (Redis)

- Список (`GET /api/articles`) кешується на 30с за ключем `articles:list:page=<p>:limit=<l>`.
- Деталі статті (`GET /api/articles/:slug`) кешуються на 60с за ключем `articles:detail:<slug>`.
- Кожна відповідь містить заголовок `X-Cache: HIT|MISS` — зручно для порівняння продуктивності
  з кешем і без нього.
- `POST /api/articles/:slug/view` оновлює БД і видаляє (`DEL`) кешований запис деталей статті,
  демонструючи інвалідацію кешу після запису.
- Якщо Redis недоступний, ендпоінти працюють напряму з БД (без кешу), а не падають.
- `DISABLE_CACHE=true npm run dev` повністю вимикає кеш (для порівняльного навантажувального
  тестування, див. `../load-tests`).
