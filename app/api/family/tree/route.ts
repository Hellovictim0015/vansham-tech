import { query } from "@/lib/server/db";
import { protect, json } from "@/lib/server/http";

export const GET = protect(async (_req, user) => {
  const trees = await query("SELECT id FROM family_trees WHERE user_id = ? LIMIT 1", [
    user.userId,
  ]);
  if (trees.length === 0) return json({ message: "Family tree not found" }, 404);
  const treeId = trees[0].id;

  const members = await query("SELECT * FROM family_members WHERE tree_id = ?", [treeId]);
  const spouses = await query(
    `SELECT * FROM family_spouses
     WHERE member_id IN (SELECT id FROM family_members WHERE tree_id = ?)`,
    [treeId],
  );

  // A spouse is always inserted after the partner it was added to, so the
  // member with the larger id in a spouse pair is the SPOUSE (the other keeps its role).
  const spouseSet = new Set<number>();
  spouses.forEach((s) => {
    spouseSet.add(Math.max(s.member_id, s.spouse_id));
  });

  const membersWithRole = members.map((m) => {
    let role = "ROOT";
    if (m.parent_id !== null) role = "CHILD";
    if (spouseSet.has(m.id) && m.parent_id === null) role = "SPOUSE";
    return { ...m, role };
  });

  return json({ tree_id: treeId, members: membersWithRole, spouses });
});
