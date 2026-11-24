import Link from "next/link";
import { getSession } from "@/server/auth";
import { signOutAction } from "../server/actions/sign-out";

// Reads the session, so it must render inside a <Suspense> boundary.
export async function UserMenu() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link href="/sign-in" className="hover:underline">
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="rounded bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-600 dark:text-gray-400">
        {session.user.name}
      </span>
      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded border border-gray-300 px-3 py-1.5 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
