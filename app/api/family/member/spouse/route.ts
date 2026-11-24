import { exec, query } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";

export const POST = protect(async (req, user) => {
  const { member_id, full_name, gender } = await readJson(req);
  if (!member_id || !full_name)
    return json({ message: "member_id and full_name required" }, 400);

  const trees = await query("SELECT id FROM family_trees WHERE user_id = ? LIMIT 1", [
    user.userId,
  ]);
  if (trees.length === 0) return json({ message: "Family tree not found" }, 400);
  const tree_id = trees[0].id;

  const partners = await query("SELECT level, tree_id FROM family_members WHERE id = ?", [
    member_id,
  ]);
  const partner = partners[0];
  if (!partner) return json({ message: "Partner not found" }, 404);
  if (partner.tree_id !== tree_id)
    return json({ message: "Member does not belong to your tree" }, 403);

  const spouse = await exec(
    `INSERT INTO family_members (tree_id, parent_id, level, full_name, gender)
     VALUES (?, NULL, ?, ?, ?)`,
    [tree_id, partner.level, full_name, gender ?? null],
  );
  const spouseId = spouse.insertId;

  await exec("INSERT INTO family_spouses (member_id, spouse_id) VALUES (?, ?), (?, ?)", [
    member_id,
    spouseId,
    spouseId,
    member_id,
  ]);
  return json({ message: "Spouse added", spouse_id: spouseId, tree_id });
});
