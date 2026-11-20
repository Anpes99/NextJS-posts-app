import { NextResponse, type NextRequest } from "next/server";
import { createPost } from "@/features/posts/server/mutations/create-post";
import { getPostsPage } from "@/features/posts/server/queries/get-posts-page";
import { ValidationError } from "@/server/errors";

export async function GET(request: NextRequest) {
  try {
    const page = await getPostsPage(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    return NextResponse.json(page);
  } catch (error) {
    return handleError({ error, message: "Invalid query" });
  }
}

export async function POST(request: Request) {
  try {
    const isForm = request.headers
      .get("content-type")
      ?.startsWith("multipart/form-data");
    const body = isForm
      ? await request
          .formData()
          .then(Object.fromEntries)
          .catch(() => null)
      : await request.json().catch(() => null);
    const post = await createPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return handleError({ error, message: "Invalid post" });
  }
}

function handleError({ error, message }: { error: unknown; message: string }) {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: message, issues: error.fieldErrors },
      { status: 400 },
    );
  }
  throw error;
}
