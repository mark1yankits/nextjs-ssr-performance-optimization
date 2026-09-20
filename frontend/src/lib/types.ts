export interface ArticleListItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  view_count: number;
  published_at: string;
}

export interface Article extends ArticleListItem {
  content: string;
}

export interface ArticleListResponse {
  items: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
