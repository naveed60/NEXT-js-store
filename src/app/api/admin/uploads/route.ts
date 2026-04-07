// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { getServerSession } = require("next-auth") as any;
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import { authOptions } from "@/lib/auth";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const sanitizeFileName = (input: string) =>
  input.replace(/[^\w.-]/g, "_").slice(0, 64) || `upload-${Date.now()}`;

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
    const fileName = `products/${Date.now()}-${sanitizeFileName((file as File).name ?? "upload")}`;
    const blob = await put(fileName, file, { access: "public" });

    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    console.error("[upload]", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
