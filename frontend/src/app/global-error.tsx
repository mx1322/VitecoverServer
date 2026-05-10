"use client";

import { ErrorFallback } from "@/components/error-fallback";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="zh-CN">
      <body>
        <ErrorFallback reset={reset} />
      </body>
    </html>
  );
}
