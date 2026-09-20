import { Suspense } from "react";

import { SlowArticleSection } from "./SlowArticleSection";

export const dynamic = "force-dynamic";

export default function StreamingPage() {
  const renderedAt = new Date().toISOString();

  return (
    <div>
      <h1>Streaming SSR: список статей</h1>
      <p>
        Цей заголовок і час рендерингу (<code>{renderedAt}</code>) віддаються браузеру одразу —
        першим байтом відповіді. Список статей нижче навмисно затримано на 2с через{" "}
        <code>&lt;Suspense&gt;</code>, щоб продемонструвати: контент з&apos;являється пізніше,
        не блокуючи початок рендерингу сторінки.
      </p>

      <Suspense fallback={<p>Завантаження списку статей…</p>}>
        <SlowArticleSection />
      </Suspense>
    </div>
  );
}
