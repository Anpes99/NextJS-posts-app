"use client"; // error boundaries must be Client Components

import { ErrorFallback } from "@/components/error-fallback";

export default function Error(props: { error: unknown; retry: () => void }) {
  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <ErrorFallback {...props} />
    </main>
  );
}
