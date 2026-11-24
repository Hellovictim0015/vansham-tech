import { exec, query } from "@/lib/server/db";
import { protect, json } from "@/lib/server/http";
import { getRazorpay } from "@/lib/server/razorpay";
import { uploadFile, MAX_UPLOAD_BYTES } from "@/lib/server/storage";

export const POST = protect(async (req, user) => {
  const form = await req.formData();
  const member_id = form.get("member_id");
  const title = form.get("title");
  const bio = form.get("bio");
  const photoFile = form.get("photo");

  if (!member_id || !title || !bio)
    return json({ message: "member_id, title and bio are required" }, 400);

  const amount = 999;

  let photo: string | null = null;
  if (photoFile instanceof File && photoFile.size > 0) {
    if (photoFile.size > MAX_UPLOAD_BYTES) return json({ message: "Photo exceeds 5 MB" }, 400);
    photo = await uploadFile(photoFile, "kul-ratna");
  }

  const trees = await query("SELECT id FROM family_trees WHERE user_id = ? LIMIT 1", [
    user.userId,
  ]);
  if (!trees.length) return json({ message: "Family tree not found for this user" }, 400);

  const result = await exec(
    `INSERT INTO kul_ratna_requests
     (tree_id, member_id, title, bio, photo, amount, payment_status)
     VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`,
    [trees[0].id, member_id, title, bio, photo, amount],
  );

  const order = await getRazorpay().orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `kul_ratna_${result.insertId}`,
  });

  return json({
    success: true,
    message: "Kul Ratna request created",
    request_id: result.insertId,
    order_id: order.id,
    amount,
  });
});

