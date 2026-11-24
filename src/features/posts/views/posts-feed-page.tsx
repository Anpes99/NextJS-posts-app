import { Suspense } from "react";
import { CreatePostModal } from "../components/create-post-modal";
import { PostList } from "../components/post-list";
import { PostListSkeleton } from "../components/post-list-skeleton";
import { PostsPagination } from "../components/posts-pagination";
import { notFound } from "next/navigation";
import { getPostsPage } from "../server/queries/get-posts-page";
import { getSession } from "@/server/auth";
import { ValidationError } from "@/server/errors";

async function PostsFeed({
  searchParams,
}: Pick<PageProps<"/">, "searchParams">) {
  const { cursor } = await searchParams;
  const { posts, nextCursor } = await getPostsPage({ cursor }).catch(
    (error) => {
      // An invalid ?cursor= is a URL that doesn't exist.
      if (error instanceof ValidationError) notFound();
      throw error;
    },
  );

  return (
    <>
      <PostList posts={posts} />
      <PostsPagination
        isFirstPage={cursor === undefined}
        nextCursor={nextCursor}
      />
    </>
  );
}

async function CreatePost() {
  const session = await getSession();
  return session ? <CreatePostModal /> : null;
}

export function PostsFeedPage({
  searchParams,
}: Pick<PageProps<"/">, "searchParams">) {
  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Suspense fallback={null}>
          <CreatePost />
        </Suspense>
      </div>
      <Suspense fallback={<PostListSkeleton />}>
        <PostsFeed searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
