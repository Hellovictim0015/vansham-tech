import { exec, query } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";

export const POST = protect(async (req, user) => {
  const { parent_id, full_name, gender } = await readJson(req);
  if (!parent_id || !full_name)
    return json({ message: "parent_id and full_name required" }, 400);

  const trees = await query("SELECT id FROM family_trees WHERE user_id = ? LIMIT 1", [
    user.userId,
  ]);
  if (trees.length === 0) return json({ message: "Family tree not found for this user" }, 400);
  const tree_id = trees[0].id;

  const parents = await query("SELECT level, tree_id FROM family_members WHERE id = ?", [
    parent_id,
  ]);
  const parent = parents[0];
  if (!parent) return json({ message: "Parent not found" }, 404);
  if (parent.tree_id !== tree_id)
    return json({ message: "Parent does not belong to your tree" }, 403);

  const result = await exec(
    `INSERT INTO family_members (tree_id, parent_id, level, full_name, gender)
     VALUES (?, ?, ?, ?, ?)`,
    [tree_id, parent_id, parent.level + 1, full_name, gender ?? null],
  );
  return json({ message: "Child member added", member_id: result.insertId, tree_id });
});
