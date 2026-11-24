import { exec, query } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";

export const POST = protect(async (req, user) => {
  const body = await readJson(req);
  const tree_name = body.tree_name || body.treeName || body.tree;
  if (!tree_name)
    return json({ success: false, message: "tree_name is required in the request body" }, 400);

  const existing = await query("SELECT id FROM family_trees WHERE user_id = ? LIMIT 1", [
    user.userId,
  ]);
  if (existing.length > 0)
    return json(
      {
        success: false,
        message: "Family tree already exists for this user",
        tree_id: existing[0].id,
      },
      409,
    );

  const result = await exec("INSERT INTO family_trees (user_id, tree_name) VALUES (?, ?)", [
    user.userId,
    tree_name,
  ]);
  return json(
    {
      success: true,
      message: "Family tree created successfully",
      data: { tree_id: result.insertId, tree_name },
    },
    201,
  );
});
