import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost } from "../server/queries/get-post";

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

  return (
    <article>
      <h1 className="text-3xl font-bold">{post.title}</h1>
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
  );
}
