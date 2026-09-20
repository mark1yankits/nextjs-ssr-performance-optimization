import { ArticleList } from "@/components/ArticleList";
import { ApiError, fetchApi } from "@/lib/api";
import { ArticleListResponse } from "@/lib/types";

// Artificial delay purely to make the Suspense boundary's streaming visible —
// a real page would suspend on genuinely slow work (a heavy query, a slow upstream call).
const ARTIFICIAL_DELAY_MS = 2000;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getArticles() {
  await delay(ARTIFICIAL_DELAY_MS);
  return fetchApi<ArticleListResponse>("/api/articles?page=1&limit=20", {
    cache: "no-store",
  });
}

export async function SlowArticleSection() {
  const streamedAt = new Date().toISOString();

  let data: ArticleListResponse | null = null;
  let error: string | null = null;

  try {
    data = await getArticles();
  } catch (err) {
    error = err instanceof ApiError ? err.message : "Не вдалося завантажити дані з API";
  }

  return (
    <div>
      <p>
        Цей блок дозавантажився через <code>{ARTIFICIAL_DELAY_MS}мс</code> о{" "}
        <code>{streamedAt}</code>, не блокуючи решту сторінки.
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
