import { ArticleList } from "@/components/ArticleList";
import { ApiError, fetchApi } from "@/lib/api";
import { ArticleListResponse } from "@/lib/types";

// Guarantees this route is rendered fresh on every request — no caching,
// no static generation — so it stays comparable to the ISR/streaming demos.
export const dynamic = "force-dynamic";

function getArticles() {
  return fetchApi<ArticleListResponse>("/api/articles?page=1&limit=20", {
    cache: "no-store",
  });
}

export default async function SsrPage() {
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
      <h1>SSR: список статей</h1>
      <p>
        Рендериться на сервері при кожному запиті (<code>dynamic = &quot;force-dynamic&quot;</code>,{" "}
        <code>cache: &quot;no-store&quot;</code>). Час рендерингу: <code>{renderedAt}</code> —
        оновіть сторінку, щоб побачити зміну.
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
