import { exec, query } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";

export const POST = protect(async (req, user) => {
  const { referral_number } = await readJson(req);
  if (!referral_number) return json({ message: "Referral number is required" }, 400);

  const rows = await query("SELECT my_referral_code, referral_status FROM users WHERE id = ?", [
    user.userId,
  ]);
  if (rows.length === 0) return json({ message: "User not found" }, 404);
  const cur = rows[0];

  if (cur.referral_status === 1) return json({ message: "Referral already added" }, 400);
  if (cur.my_referral_code === referral_number)
    return json({ message: "You cannot use your own referral code" }, 400);

  const ref = await query("SELECT id FROM users WHERE my_referral_code = ?", [referral_number]);
  if (ref.length === 0) return json({ message: "Invalid referral code" }, 400);

  await exec("UPDATE users SET referral_number = ?, referral_status = 1 WHERE id = ?", [
    referral_number,
    user.userId,
  ]);
  return json({ message: "Referral added successfully", referral_status: true });
});
