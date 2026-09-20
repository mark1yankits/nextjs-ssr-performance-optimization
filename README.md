# Оптимізація продуктивності SSR (Next.js + Node.js)

Практичне завдання: оптимізація серверного рендерингу веб-застосунку на Next.js
з бекендом на Node.js (Express + PostgreSQL + Redis).

Деталі завдання: [ЗАВДАННЯ.md](./ЗАВДАННЯ.md)

## Структура проєкту

```
practic/
├── backend/          # Node.js API (Express) + Redis + PostgreSQL
├── frontend/         # Next.js застосунок (SSR/ISR/streaming)
├── load-tests/       # Сценарії k6
├── docs/             # Результати вимірювань, звіти, графіки
├── docker-compose.yml # PostgreSQL + Redis для локальної розробки
└── ЗАВДАННЯ.md
```

## Швидкий старт

1. Підняти базу даних та кеш:
   ```bash
   docker compose up -d
   ```
2. Скопіювати `.env.example` у `.env` (у корені, а також у `backend/` і `frontend/`, коли вони будуть створені).
3. Backend та frontend — інструкції з'являться у відповідних теках у міру реалізації.
