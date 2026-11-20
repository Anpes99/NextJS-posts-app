import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <h1 className="text-3xl font-bold">Not found</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm text-blue-600 hover:underline">
        ← Back to posts
      </Link>
    </main>
  );
}
