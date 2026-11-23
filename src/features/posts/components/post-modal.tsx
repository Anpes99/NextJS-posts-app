"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, type ReactNode } from "react";

/** Modal for the intercepted /posts/[id] route */
export function PostModal({
  children,
  fullPageHref,
}: {
  children: ReactNode;
  fullPageHref?: string;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Next.js hides routes with <Activity> instead of unmounting them. Close in the
  // cleanup (runs on hide) so showing it again reopens as a modal, not inline.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Post"
      onCancel={(event) => {
        event.preventDefault();
        router.back();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) router.back();
      }}
      className="m-auto w-full max-w-2xl rounded-lg bg-background p-6 text-foreground backdrop:bg-black/50"
    >
      <div className="mb-4 flex items-center justify-between">
        {/* Plain <a>, not <Link>: a client navigation to this URL would be
            intercepted again, a full load renders the real post page. */}
        {fullPageHref && (
          <a href={fullPageHref} className="text-sm text-blue-600 hover:underline">
            Open full page →
          </a>
        )}
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Close"
          className="ml-auto rounded px-2 text-2xl leading-none hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
