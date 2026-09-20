import { pool } from "./pool";
import { Article } from "./types";

export type ArticleListItem = Omit<Article, "content">;

export interface ListArticlesParams {
  page: number;
  limit: number;
}

export interface ListArticlesResult {
  items: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function listArticles({ page, limit }: ListArticlesParams): Promise<ListArticlesResult> {
  const offset = (page - 1) * limit;

  const [itemsResult, countResult] = await Promise.all([
    pool.query<ArticleListItem>(
      `SELECT id, slug, title, excerpt, author, view_count, published_at
       FROM articles
       ORDER BY published_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    ),
    pool.query<{ count: string }>("SELECT count(*) FROM articles"),
  ]);

  const total = Number(countResult.rows[0].count);

  return {
    items: itemsResult.rows,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const result = await pool.query<Article>(
    `SELECT id, slug, title, excerpt, content, author, view_count, published_at
     FROM articles
     WHERE slug = $1`,
    [slug],
  );

  return result.rows[0] ?? null;
}

export async function incrementViewCount(slug: string): Promise<Article | null> {
  const result = await pool.query<Article>(
    `UPDATE articles
     SET view_count = view_count + 1
     WHERE slug = $1
     RETURNING id, slug, title, excerpt, content, author, view_count, published_at`,
    [slug],
  );

  return result.rows[0] ?? null;
}
