# Навантажувальне тестування (k6)

## Встановлення k6

```bash
brew install k6
# або завантажити бінарник з https://github.com/grafana/k6/releases
```

## Сценарії

- `backend-list.js` — `GET /api/articles?page=1&limit=20`
- `backend-detail.js` — `GET /api/articles/:slug` (slug визначається автоматично в `setup()`)
- `frontend-pages.js` — сторінки Next.js, параметризовано через `-e PAGE=/ssr|/isr|/streaming`

Усі скрипти: 20 VU, 30с, поріг `http_req_failed rate<0.01`.

## Порівняння з кешем / без кешу (backend)

Кеш вимикається змінною середовища `DISABLE_CACHE` на бекенді — це дає чисте порівняння
без штучних трюків із випадковими ключами.

```bash
# 1. Backend з кешем (за замовчуванням)
cd backend && npm run dev

# в іншому терміналі:
cd load-tests
k6 run backend-list.js
k6 run backend-detail.js

# 2. Backend без кешу
cd backend && DISABLE_CACHE=true npm run dev

# в іншому терміналі:
cd load-tests
k6 run backend-list.js
k6 run backend-detail.js
```

### Приклад результатів (Neon, віддалена БД)

| Ендпоінт | Кеш | p95 latency | Throughput | cache_hit_rate |
|---|---|---|---|---|
| `GET /api/articles` | увімкнено | 10.5 мс | 182 req/s | 99.6% |
| `GET /api/articles` | вимкнено | 442 мс | 37 req/s | 0% |
| `GET /api/articles/:slug` | увімкнено | 19.5 мс | 174 req/s | 99.6% |
| `GET /api/articles/:slug` | вимкнено | 177 мс | 75 req/s | 0% |

Різниця настільки суттєва через мережеву затримку до Neon (БД у хмарі, не localhost) —
саме такі випадки Redis-кеш і покликаний згладжувати.

## Порівняння стратегій рендерингу (frontend)

Обов'язково production-білд — у `npm run dev` Next.js завжди рендерить наживо, і ISR
буде виглядати як SSR:

```bash
cd frontend
npm run build
npm run start

# в іншому терміналі (backend теж має бути запущений):
cd load-tests
k6 run frontend-pages.js -e PAGE=/ssr
k6 run frontend-pages.js -e PAGE=/isr
k6 run frontend-pages.js -e PAGE=/streaming
```

### Приклад результатів

| Сторінка | p95 latency | Throughput |
|---|---|---|
| `/ssr` | 44 мс | 142 req/s |
| `/isr` | 9 мс | 193 req/s |
| `/streaming` | 3.1 с | 9 req/s |

`/streaming` навмисно повільний (2с штучна затримка в `SlowArticleSection.tsx`) —
під навантаженням це видно і в пропускній здатності: перевага стрімінгу не в
загальній пропускній здатності сервера, а в тому, що браузер отримує перший байт
(TTFB) майже миттєво, не чекаючи на повільну частину (див. `frontend/README.md`).
