"use client";

import { useRef, useState, type SubmitEvent } from "react";
import { createPostAction } from "../server/actions/create-post";

type FieldErrors = Record<string, string[] | undefined>;

const inputClass =
  "mt-1 w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-sm text-red-600">{messages[0]}</p>;
}

export function CreatePostModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setLoading(true);
    setFormError(null);

    try {
      const result = await createPostAction(new FormData(form));
      if (!result.ok) {
        setErrors(result.errors);
        setFormError(result.formError ?? null);
        return;
      }
      form.reset();
      setErrors({});
      dialogRef.current?.close();
    } catch {
      setFormError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        New post
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="create-post-title"
        className="m-auto w-full max-w-lg rounded-lg bg-background p-6 text-foreground backdrop:bg-black/50"
      >
        <h2 id="create-post-title" className="text-xl font-semibold">
          New post
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Title</span>
            <input
              name="title"
              required
              maxLength={120}
              className={inputClass}
            />
            <FieldError messages={errors.title} />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Text</span>
            <textarea
              name="text"
              required
              maxLength={5000}
              rows={5}
              className={inputClass}
            />
            <FieldError messages={errors.text} />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Image (optional)</span>
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-1 block w-full text-sm"
            />
            <FieldError messages={errors.image} />
          </label>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
