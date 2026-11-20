import { PostPage } from "@/features/posts/views/post-page";

export default async function Page({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  return <PostPage postId={id} />;
}
