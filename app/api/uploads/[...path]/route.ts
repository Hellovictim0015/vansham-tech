import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { UPLOAD_ROOT } from "@/lib/server/storage";

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

export async function GET(_req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  const file = path.resolve(UPLOAD_ROOT, ...parts);
  // block path traversal outside uploads/
  if (!file.startsWith(UPLOAD_ROOT + path.sep))
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  try {
    const data = await fs.readFile(file);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
}
