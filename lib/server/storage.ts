import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

/** Files are stored in <project root>/uploads (not in /public) and served via /api/uploads/... */
export const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function uploadFile(file: File, folder: string) {
  const ext = (file.name.split(".").pop() || "bin").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const name = `${crypto.randomUUID()}.${ext || "bin"}`;
  const dir = path.join(UPLOAD_ROOT, folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/api/uploads/${folder}/${name}`;
}
