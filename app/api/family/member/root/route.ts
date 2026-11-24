import { exec, query } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";

export const POST = protect(async (req, user) => {
  const { full_name, gender } = await readJson(req);
  if (!full_name) return json({ message: "full_name is required" }, 400);

  const trees = await query("SELECT id FROM family_trees WHERE user_id = ? LIMIT 1", [
    user.userId,
  ]);
  if (trees.length === 0) return json({ message: "Family tree not found for this user" }, 400);
  const tree_id = trees[0].id;

  const result = await exec(
    `INSERT INTO family_members (tree_id, parent_id, level, full_name, gender)
     VALUES (?, NULL, 0, ?, ?)`,
    [tree_id, full_name, gender ?? null],
  );
  return json({ message: "Root member added", member_id: result.insertId, tree_id });
});
