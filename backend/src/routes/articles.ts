import { Router } from "express";

import { getArticleBySlug, listArticles } from "../db/articles.repository";
import { asyncHandler } from "../utils/asyncHandler";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const articlesRouter = Router();

articlesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(req.query.limit) || DEFAULT_LIMIT));

    const result = await listArticles({ page, limit });
    res.json(result);
  }),
);

articlesRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const article = await getArticleBySlug(req.params.slug);

    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    res.json(article);
  }),
);
