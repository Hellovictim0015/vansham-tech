import { query } from "@/lib/server/db";
import { protect, json } from "@/lib/server/http";

export const GET = protect(async (_req, user) => {
  const trees = await query("SELECT id FROM family_trees WHERE user_id = ? LIMIT 1", [
    user.userId,
  ]);
  if (trees.length === 0) return json({ message: "Family tree not found" }, 404);
  const members = await query("SELECT id, full_name FROM family_members WHERE tree_id = ?", [
    trees[0].id,
  ]);
  return json({ members });
});
