"use client";

import { useEffect } from "react";

/** Shared UI for error.tsx boundaries. */
export function ErrorFallback({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Server errors only expose a digest in production, matching the server logs.
  const digest =
    error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <div
      role="alert"
      className="mt-4 rounded-lg border border-red-200 p-6 dark:border-red-900"
    >
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        This might be temporary. Try again, or come back later.
      </p>
      {digest && (
        <p className="mt-2 font-mono text-xs text-gray-500">
          Error ID: {digest}
        </p>
      )}
      <button
        type="button"
        onClick={() => retry()}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
