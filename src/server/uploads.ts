import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;

const CONTENT_TYPES = Object.fromEntries(
  Object.entries(IMAGE_TYPES).map(([type, ext]) => [ext, type]),
);

export async function saveImage({ file }: { file: File }): Promise<string> {
  const ext = IMAGE_TYPES[file.type as keyof typeof IMAGE_TYPES];
  const filename = `${randomUUID()}.${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(
    path.join(UPLOAD_DIR, filename),
    Buffer.from(await file.arrayBuffer()),
  );
  return `/uploads/${filename}`;
}

const FILENAME_PATTERN = /^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/;

export async function readUpload({
  filename,
}: {
  filename: string;
}): Promise<{ data: Buffer; contentType: string } | null> {
  if (!FILENAME_PATTERN.test(filename)) return null;

  try {
    const data = await readFile(path.join(UPLOAD_DIR, filename));
    const contentType = CONTENT_TYPES[path.extname(filename).slice(1)];
    return { data, contentType };
  } catch {
    return null;
  }
}

export async function deleteImage({ url }: { url: string }): Promise<void> {
  const filename = url.replace(/^\/uploads\//, "");
  if (!FILENAME_PATTERN.test(filename)) return;
  await rm(path.join(UPLOAD_DIR, filename), { force: true });
}
