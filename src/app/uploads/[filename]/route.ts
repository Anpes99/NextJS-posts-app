import { readUpload } from "@/server/uploads";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/uploads/[filename]">,
) {
  const { filename } = await params;
  const file = await readUpload({ filename });

  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      // Filenames are random UUIDs, so a URL's content never changes.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
