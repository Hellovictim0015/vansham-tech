import { exec } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";
import { getRazorpay } from "@/lib/server/razorpay";

const PRICES: Record<string, number> = { basic: 2999, advanced: 4999, complete: 7999 };

export const POST = protect(async (req, user) => {
  const b = await readJson(req);
  const amount = PRICES[b.dna_level];
  if (!amount) return json({ success: false, message: "Invalid dna_level" }, 400);

  const order = await getRazorpay().orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `dna_${Date.now()}`,
  });

  const result = await exec(
    `INSERT INTO dna_orders
     (user_id,name,mobile,email,address,city,zip,dna_level,collection_method,razorpay_order_id,payment_status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      user.userId ?? null,
      b.name || null,
      b.mobile || null,
      b.email || null,
      b.address || null,
      b.city || null,
      b.zip || null,
      b.dna_level,
      b.collection_method || "home",
      order.id,
      "pending",
    ],
  );
  return json({ success: true, order_id: result.insertId, razorpay_order_id: order.id });
});
