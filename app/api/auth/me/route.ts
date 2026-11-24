import { query } from "@/lib/server/db";
import { protect, json } from "@/lib/server/http";

export const GET = protect(async (_req, user) => {
  const rows = await query(
    `SELECT id, name, mobile_number, referral_number, referral_status, my_referral_code,
            payment, created_at, updated_at FROM users WHERE id = ?`,
    [user.userId],
  );
  if (rows.length === 0) return json({ success: false, message: "User not found" }, 404);
  return json({ success: true, data: rows[0] });
});
