import { exec, query } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";

export const POST = protect(async (req, user) => {
  const { member_id, title, description } = await readJson(req);
  const trees = await query("SELECT id FROM family_trees WHERE user_id = ? LIMIT 1", [
    user.userId,
  ]);
  if (trees.length === 0) return json({ message: "Tree not found" }, 404);

  const result = await exec(
    "INSERT INTO kul_ratna (tree_id, member_id, title, description) VALUES (?, ?, ?, ?)",
    [trees[0].id, member_id, title, description],
  );
  return json({ message: "Kul Ratna added", id: result.insertId });
});
