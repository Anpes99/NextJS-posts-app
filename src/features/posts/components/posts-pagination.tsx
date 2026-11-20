import Link from "next/link";

const linkClass = "text-sm text-blue-600 hover:underline";

export function PostsPagination({
  isFirstPage,
  nextCursor,
}: {
  isFirstPage: boolean;
  nextCursor: number | null;
}) {
  if (isFirstPage && nextCursor === null) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex justify-between">
      {isFirstPage ? <span /> : <Link href="/" className={linkClass}>← Newest</Link>}
      {nextCursor !== null && (
        <Link href={`/?cursor=${nextCursor}`} className={linkClass}>
          Older posts →
        </Link>
      )}
    </nav>
  );
}
