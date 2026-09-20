import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Оптимізація продуктивності SSR</h1>
      <p>
        Демонстраційний Next.js застосунок з бекендом на Express + PostgreSQL + Redis.
        Сторінки з різними стратегіями рендерингу:
      </p>
      <ul>
        <li>
          <Link href="/ssr">SSR</Link> — рендеринг на сервері при кожному запиті
        </li>
      </ul>
    </div>
  );
}
