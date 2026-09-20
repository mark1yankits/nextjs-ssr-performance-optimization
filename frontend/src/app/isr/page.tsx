import { ArticleList } from "@/components/ArticleList";
import { ApiError, fetchApi } from "@/lib/api";
import { ArticleListResponse } from "@/lib/types";

const REVALIDATE_SECONDS = 30;

function getArticles() {
  return fetchApi<ArticleListResponse>("/api/articles?page=1&limit=20", {
    next: { revalidate: REVALIDATE_SECONDS },
  });
}

export default async function IsrPage() {
  const renderedAt = new Date().toISOString();

  let data: ArticleListResponse | null = null;
  let error: string | null = null;

  try {
    data = await getArticles();
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Не вдалося завантажити дані з API";
  }

  return (
    <div>
      <h1>ISR: список статей</h1>
      <p>
        Сторінка кешується і оновлюється фоново не частіше ніж раз на {REVALIDATE_SECONDS}с (
        <code>next: {"{"} revalidate: {REVALIDATE_SECONDS} {"}"}</code>). Час рендерингу:{" "}
        <code>{renderedAt}</code> — не змінюється між оновленнями сторінки в межах вікна
        ревалідації. Перевіряти в production-режимі (<code>npm run build && npm run start</code>) —
        у режимі розробки Next.js рендерить сторінку заново щоразу.
      </p>

      {error && <p role="alert">Помилка: {error}</p>}

      {data && (
        <>
          <p>
            Всього: {data.total}, сторінка {data.page} з {data.totalPages}
          </p>
          <ArticleList items={data.items} />
        </>
      )}
    </div>
  );
}
