import { exec, query } from "@/lib/server/db";
import { protect, json } from "@/lib/server/http";
import { uploadFile, MAX_UPLOAD_BYTES } from "@/lib/server/storage";

export const POST = protect(async (req, user) => {
  const form = await req.formData();
  const title = form.get("title");
  const description = form.get("description");
  const purpose = form.get("purpose");
  const file = form.get("photo");

  const PURPOSES = ["Weddings", "Elders", "Ancestral Home", "Travels"];
  if (!purpose || !PURPOSES.includes(String(purpose)))
    return json({ message: `purpose must be one of: ${PURPOSES.join(", ")}` }, 400);

  if (!(file instanceof File) || file.size === 0)
    return json({ message: "Image is required" }, 400);
  if (file.size > MAX_UPLOAD_BYTES) return json({ message: "Image exceeds 5 MB" }, 400);

  const users = await query("SELECT id FROM users WHERE id = ?", [user.userId]);
  if (!users.length) return json({ message: "Invalid user" }, 400);

  const imageUrl = await uploadFile(file, "gallery");
  await exec(
    "INSERT INTO gallery (user_id, title, description, photo, purpose) VALUES (?, ?, ?, ?, ?)",
    [user.userId, title, description, imageUrl, purpose],
  );
  return json({ message: "Gallery added successfully", imageUrl });
});
