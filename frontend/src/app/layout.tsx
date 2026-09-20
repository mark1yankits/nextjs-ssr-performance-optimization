import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "SSR Performance Practicum",
  description: "Next.js SSR/ISR/streaming demo backed by an Express + PostgreSQL + Redis API",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk">
      <body>
        <header className="site-header">
          <strong>SSR Performance Practicum</strong>
          <nav>
            <Link href="/">Головна</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
