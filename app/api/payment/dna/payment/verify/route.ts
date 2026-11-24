import { exec, query } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";
import { verifySignature } from "@/lib/server/razorpay";

export const POST = protect(async (req) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await readJson(req);
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return json({ success: false, message: "Missing payment parameters" }, 400);

  if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature))
    return json({ success: false, message: "Invalid signature" }, 400);

  const order = await query("SELECT id FROM dna_orders WHERE razorpay_order_id=?", [
    razorpay_order_id,
  ]);
  if (order.length === 0) return json({ success: false, message: "Order not found" }, 404);

  await exec(
    `UPDATE dna_orders SET payment_status='paid', order_status='payment_done',
     razorpay_payment_id=? WHERE razorpay_order_id=?`,
    [razorpay_payment_id, razorpay_order_id],
  );
  return json({ success: true, message: "Payment verified successfully" });
});
