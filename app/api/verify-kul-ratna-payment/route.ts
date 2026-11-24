import { exec } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";
import { verifySignature } from "@/lib/server/razorpay";

export const POST = protect(async (req) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, request_id } =
    await readJson(req);
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !request_id)
    return json({ message: "Missing required payment details" }, 400);

  if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature))
    return json({ success: false, message: "Payment verification failed" }, 400);

  await exec(
    `UPDATE kul_ratna_requests SET payment_status='PAID', payment_id=?
     WHERE id=?`,
    [razorpay_payment_id, request_id],
  );
  return json({ success: true, message: "Payment successful. Waiting for admin approval" });
});
