import { ArticleListItem } from "@/lib/types";

export function ArticleList({ items }: { items: ArticleListItem[] }) {
  return (
    <ul>
      {items.map((article) => (
        <li key={article.id}>
          <strong>{article.title}</strong> — {article.author} ·{" "}
          {new Date(article.published_at).toLocaleString("uk-UA")} · перегляди:{" "}
          {article.view_count}
        </li>
      ))}
    </ul>
  );
}
