import { PostsFeedPage } from "@/features/posts/views/posts-feed-page";

export default function Page({ searchParams }: PageProps<"/">) {
  return <PostsFeedPage searchParams={searchParams} />;
}
