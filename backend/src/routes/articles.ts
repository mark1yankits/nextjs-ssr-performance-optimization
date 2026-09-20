import { Router } from "express";

import { getOrSetCache, invalidateCache } from "../cache/cache";
import { getArticleBySlug, incrementViewCount, listArticles } from "../db/articles.repository";
import { asyncHandler } from "../utils/asyncHandler";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const LIST_CACHE_TTL_SECONDS = 30;
const DETAIL_CACHE_TTL_SECONDS = 60;

const detailCacheKey = (slug: string) => `articles:detail:${slug}`;

export const articlesRouter = Router();

articlesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(req.query.limit) || DEFAULT_LIMIT));

    const cacheKey = `articles:list:page=${page}:limit=${limit}`;
    const { data, hit } = await getOrSetCache(cacheKey, LIST_CACHE_TTL_SECONDS, () =>
      listArticles({ page, limit }),
    );

    res.set("X-Cache", hit ? "HIT" : "MISS");
    res.json(data);
  }),
);

articlesRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const { data: article, hit } = await getOrSetCache(detailCacheKey(slug), DETAIL_CACHE_TTL_SECONDS, () =>
      getArticleBySlug(slug),
    );

    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    res.set("X-Cache", hit ? "HIT" : "MISS");
    res.json(article);
  }),
);

// Demonstrates cache invalidation: a write updates Postgres, then drops the
// stale cached representation of that article so the next GET repopulates it.
articlesRouter.post(
  "/:slug/view",
  asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const article = await incrementViewCount(slug);

    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    await invalidateCache(detailCacheKey(slug));
    res.json(article);
  }),
);
