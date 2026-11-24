import Image from "next/image";
import { notFound } from "next/navigation";
import { getSession } from "@/server/auth";
import { getPost } from "../server/queries/get-post";
import { EditablePost } from "./editable-post";

export function PostDetailSkeleton() {
  return (
    <div aria-busy="true" className="animate-pulse space-y-4">
      <div className="h-9 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}

/** Post content shared by the full post page and the feed's post modal. */
export async function PostDetail({ postId }: { postId: string }) {
  const post = await getPost({ postId }); // validated in the data access layer

  if (!post) {
    notFound();
  }

  // Not awaited: the post renders right away, and only the author's edit, delete buttons wait
  // for the session (unwrapped with use() behind a Suspense boundary).
  const isOwnerPromise = getSession()
    .then((session) => session?.user.id === post.authorId)
    .catch(() => false);

  return (
    <EditablePost
      post={{ id: post.id, text: post.text }}
      isOwnerPromise={isOwnerPromise}
    >
      <article>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="mt-1 text-sm text-gray-500">by {post.author.name}</p>
        {post.imageUrl && (
          <div className="relative mt-4 aspect-video overflow-hidden rounded-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(min-width: 672px) 672px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <p className="mt-4 text-lg">{post.text}</p>
      </article>
    </EditablePost>
  );
}
