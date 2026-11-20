import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getPost } from "../server/queries/get-post";

function PostPageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back
      </Link>
      {children}
    </main>
  );
}

export function PostPageSkeleton() {
  return (
    <PostPageLayout>
      <div aria-busy="true" className="mt-4 animate-pulse space-y-4">
        <div className="h-9 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-full rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </PostPageLayout>
  );
}

export async function PostPage({ postId }: { postId: string }) {
  const post = await getPost({ postId }); // validated in the data access layer

  if (!post) {
    notFound();
  }

  return (
    <PostPageLayout>
      <article>
        <h1 className="mt-4 text-3xl font-bold">{post.title}</h1>
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
    </PostPageLayout>
  );
}
