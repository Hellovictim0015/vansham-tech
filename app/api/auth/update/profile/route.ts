import { exec } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";

export const PUT = protect(async (req, user) => {
  const { name, referral_number, referral_status } = await readJson(req);
  const fields: string[] = [];
  const values: unknown[] = [];
  if (name !== undefined) { fields.push("name = ?"); values.push(name); }
  if (referral_number !== undefined) { fields.push("referral_number = ?"); values.push(referral_number); }
  if (referral_status !== undefined) { fields.push("referral_status = ?"); values.push(referral_status); }
  if (fields.length === 0)
    return json({ success: false, message: "No fields provided to update" }, 400);

  values.push(user.userId);
  await exec(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
  return json({ success: true, message: "User updated successfully" });
});
