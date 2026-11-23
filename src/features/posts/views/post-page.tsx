import Link from "next/link";
import type { ReactNode } from "react";
import { PostDetail, PostDetailSkeleton } from "../components/post-detail";

function PostPageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back
      </Link>
      <div className="mt-4">{children}</div>
    </main>
  );
}

export function PostPageSkeleton() {
  return (
    <PostPageLayout>
      <PostDetailSkeleton />
    </PostPageLayout>
  );
}

/** Full post page: shown on direct visits and reloads of /posts/[id]. */
export function PostPage({ postId }: { postId: string }) {
  return (
    <PostPageLayout>
      <PostDetail postId={postId} />
    </PostPageLayout>
  );
}
