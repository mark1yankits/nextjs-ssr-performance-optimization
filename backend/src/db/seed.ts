import { pool } from "./pool";

const TOPICS = [
  "Node.js",
  "Next.js",
  "PostgreSQL",
  "Redis",
  "React",
  "TypeScript",
  "Продуктивність",
  "Кешування",
  "SSR",
  "Streaming",
];

const AUTHORS = [
  "Олена Коваль",
  "Іван Петренко",
  "Марія Шевченко",
  "Андрій Бондар",
  "Софія Ткаченко",
];

const ARTICLE_COUNT = 5000;
const BATCH_SIZE = 500;

function slugify(text: string, id: number) {
  return `${text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${id}`;
}

async function seed() {
  await pool.query("TRUNCATE TABLE articles RESTART IDENTITY");

  for (let batchStart = 0; batchStart < ARTICLE_COUNT; batchStart += BATCH_SIZE) {
    const batchEnd = Math.min(batchStart + BATCH_SIZE, ARTICLE_COUNT);
    const rowsSql: string[] = [];
    const params: unknown[] = [];

    for (let i = batchStart; i < batchEnd; i++) {
      const topic = TOPICS[i % TOPICS.length];
      const author = AUTHORS[i % AUTHORS.length];
      const title = `${topic}: практичні поради №${i + 1}`;
      const slug = slugify(`${topic}-tips`, i + 1);
      const excerpt = `Короткий огляд статті про ${topic.toLowerCase()} (стаття №${i + 1}).`;
      const content = `Це демонстраційний контент статті про ${topic}. `.repeat(50);
      const viewCount = Math.floor(Math.random() * 10000);

      const offset = params.length;
      rowsSql.push(
        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, now() - ($${offset + 7} || ' minutes')::interval)`,
      );
      params.push(slug, title, excerpt, content, author, viewCount, i);
    }

    await pool.query(
      `INSERT INTO articles (slug, title, excerpt, content, author, view_count, published_at)
       VALUES ${rowsSql.join(", ")}`,
      params,
    );

    console.log(`Seeded ${batchEnd}/${ARTICLE_COUNT}`);
  }
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
