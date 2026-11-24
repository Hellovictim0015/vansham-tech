import { exec } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";
import { getRazorpay } from "@/lib/server/razorpay";

export const POST = protect(async (req, user) => {
  const { full_name, phone, address } = await readJson(req);
  const amount = 4999;

  const result = await exec(
    "INSERT INTO dna_tests (user_id, full_name, phone, address, amount) VALUES (?, ?, ?, ?, ?)",
    [user.userId, full_name, phone, address, amount],
  );
  const order = await getRazorpay().orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `dna_test_${result.insertId}`,
  });
  return json({ order_id: order.id, amount: order.amount, test_id: result.insertId });
});
