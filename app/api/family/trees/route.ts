import { query } from "@/lib/server/db";
import { protect, json } from "@/lib/server/http";

export const GET = protect(async (_req, user) => {
  const rows = await query("SELECT * FROM family_trees WHERE user_id = ?", [user.userId]);
  return json({ data: rows });
});
