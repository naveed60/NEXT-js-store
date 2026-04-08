import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { authOptions } from "@/lib/auth";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const IS_VERCEL = process.env.VERCEL === "1";
const IS_LOCAL_DEVELOPMENT = process.env.NODE_ENV === "development";

export const runtime = "nodejs";

const sanitizeFileName = (input: string) =>
  input.replace(/[^\w.-]/g, "_").slice(0, 64) || `upload-${Date.now()}`;

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const saveToLocalUploads = async (fileName: string, file: Blob) => {
  const bytes = Buffer.from(await file.arrayBuffer());
  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  const localPath = path.join(LOCAL_UPLOAD_DIR, fileName);
  await writeFile(localPath, bytes);
  return `/uploads/${fileName}`;
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("image");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ message: "Missing image file" }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ message: "Unsupported image type. Use JPEG, PNG, WebP or GIF." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ message: "File too large. Maximum size is 5 MB." }, { status: 413 });
  }

  try {
    const safeName = sanitizeFileName((file as File).name ?? "upload");
    const localFileName = `${Date.now()}-${safeName}`;

    if (IS_LOCAL_DEVELOPMENT || !process.env.BLOB_READ_WRITE_TOKEN) {
      const url = await saveToLocalUploads(localFileName, file);
      return NextResponse.json({ url }, { status: 201 });
    }

    const blobFileName = `products/${localFileName}`;
    const blob = await put(blobFileName, file, { access: "public" });

    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    if (!IS_VERCEL) {
      try {
        const safeName = sanitizeFileName((file as File).name ?? "upload");
        const localFileName = `${Date.now()}-${safeName}`;
        const url = await saveToLocalUploads(localFileName, file);
        return NextResponse.json({ url }, { status: 201 });
      } catch (localError) {
        console.error("[upload:local-fallback]", localError);
      }
    }

    console.error("[upload]", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
