import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireRole } from "@/lib/auth";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg"];
const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_MEDIA = 50 * 1024 * 1024;

export async function POST(request: Request) {
  const { error, session } = await requireRole("MENTOR");
  if (error || !session) return error;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "File upload not configured. Set BLOB_READ_WRITE_TOKEN." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);
  const isAudio = AUDIO_TYPES.includes(file.type);

  if (!isImage && !isVideo && !isAudio) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const maxSize = isImage ? MAX_IMAGE : MAX_MEDIA;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File too large. Max ${isImage ? "5MB" : "50MB"}.` },
      { status: 400 }
    );
  }

  const blob = await put(`mentor-content/${session.user.id}/${Date.now()}-${file.name}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return NextResponse.json({
    fileUrl: blob.url,
    storageKey: blob.pathname,
    mimeType: file.type,
    fileSize: file.size,
  });
}
