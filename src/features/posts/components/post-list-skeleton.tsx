export function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul className="mt-6 space-y-4" aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="h-20 animate-pulse rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
        />
      ))}
    </ul>
  );
}
