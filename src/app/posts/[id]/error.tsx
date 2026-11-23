"use client";

import Link from "next/link";
import { ErrorFallback } from "@/components/error-fallback";

export default function Error(props: { error: unknown; retry: () => void }) {
  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back
      </Link>
      <ErrorFallback {...props} />
    </main>
  );
}
