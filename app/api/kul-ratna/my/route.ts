import { query } from "@/lib/server/db";
import { protect, json } from "@/lib/server/http";

export const GET = protect(async (_req, user) => {
  const trees = await query("SELECT id FROM family_trees WHERE user_id = ? LIMIT 1", [
    user.userId,
  ]);
  if (trees.length === 0) return json([]);

  const rows = await query(
    `SELECT k.*, f.full_name
     FROM kul_ratna k JOIN family_members f ON k.member_id = f.id
     WHERE k.tree_id = ?`,
    [trees[0].id],
  );
  return json(rows);
});
