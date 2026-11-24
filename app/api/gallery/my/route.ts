import { query } from "@/lib/server/db";
import { protect, json } from "@/lib/server/http";

export const GET = protect(async (_req, user) => {
  const rows = await query(
    `SELECT id, title, description, photo, purpose, created_at
     FROM gallery WHERE user_id = ? ORDER BY id DESC`,
    [user.userId],
  );
  return json({ total: rows.length, data: rows });
});
