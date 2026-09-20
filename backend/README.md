# Backend

Express API на TypeScript.

## Запуск

```bash
cp .env.example .env   # вставити свій Neon DATABASE_URL
npm install
npm run db:migrate
npm run db:seed        # 5000 тестових статей
npm run dev
```

Перевірка: `GET http://localhost:4000/health`

## База даних

- `src/db/migrations/*.sql` — SQL-міграції, застосовуються по черзі (`npm run db:migrate`),
  прогрес зберігається в таблиці `schema_migrations`.
- `src/db/seed.ts` — наповнює таблицю `articles` тестовими даними (`npm run db:seed`).
- Таблиця `articles` має індекс `idx_articles_published_at` для сортування/пагінації
  за датою публікації та унікальний індекс по `slug`.
