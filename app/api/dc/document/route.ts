import { exec, query } from "@/lib/server/db";
import { protect, json } from "@/lib/server/http";
import { uploadFile, MAX_UPLOAD_BYTES } from "@/lib/server/storage";

export const POST = protect(async (req, user) => {
  const form = await req.formData();
  const title = form.get("title");
  const description = form.get("description");
  const file = form.get("file");

  if (!(file instanceof File) || file.size === 0)
    return json({ message: "PDF file is required" }, 400);
  if (file.type !== "application/pdf") return json({ message: "Only PDF files allowed" }, 400);
  if (file.size > MAX_UPLOAD_BYTES) return json({ message: "File exceeds 5 MB" }, 400);

  const users = await query("SELECT id FROM users WHERE id = ?", [user.userId]);
  if (!users.length) return json({ message: "Invalid user. Please login again." }, 400);

  const fileUrl = await uploadFile(file, "documents");
  await exec(
    "INSERT INTO documents (user_id, title, description, file_url) VALUES (?, ?, ?, ?)",
    [user.userId, title, description, fileUrl],
  );
  return json({ message: "Document uploaded successfully", fileUrl });
});
