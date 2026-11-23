"use client";

import { useState, type ReactNode, type SubmitEvent } from "react";
import { deletePostAction } from "../server/actions/delete-post";
import { updatePostAction } from "../server/actions/update-post";

type FieldErrors = Record<string, string[] | undefined>;

export function EditablePost({
  post,
  children,
}: {
  post: { id: number; text: string };
  children: ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function stopEditing() {
    setEditing(false);
    setErrors({});
    setFormError(null);
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const result = await updatePostAction(new FormData(event.currentTarget));
      if (result.ok) {
        stopEditing();
      } else {
        setErrors(result.errors);
        setFormError(result.formError ?? null);
      }
    } catch {
      setFormError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!editing) {
    return (
      <>
        {children}
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded border border-gray-300 px-4 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Edit
          </button>
          <form
            action={() => deletePostAction(post.id)}
            onSubmit={(event) => {
              if (!confirm("Delete this post?")) event.preventDefault();
            }}
          >
            <button
              type="submit"
              className="rounded border border-red-300 px-4 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
            >
              Delete
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="postId" value={post.id} />
      <label className="block">
        <span className="text-sm font-medium">Text</span>
        <textarea
          name="text"
          required
          maxLength={5000}
          rows={5}
          defaultValue={post.text}
          className="mt-1 w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700"
        />
        {errors.text?.[0] && (
          <p className="mt-1 text-sm text-red-600">{errors.text[0]}</p>
        )}
      </label>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={stopEditing}
          className="rounded px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
