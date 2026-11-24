import { exec } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";
import { verifySignature } from "@/lib/server/razorpay";

export const POST = protect(async (req, user) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await readJson(req);

  if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature))
    return json({ message: "Invalid payment signature" }, 400);

  await exec("UPDATE users SET payment = 1 WHERE id = ?", [user.userId]);
  return json({ message: "Payment successful", payment: true });
});
