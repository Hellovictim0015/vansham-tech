import { exec } from "@/lib/server/db";
import { protect, json, readJson } from "@/lib/server/http";
import { verifySignature } from "@/lib/server/razorpay";

export const POST = protect(async (req, user) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, test_id } =
    await readJson(req);

  if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature))
    return json({ message: "Payment verification failed" }, 400);

  await exec(
    `UPDATE dna_tests SET payment_status='PAID', payment_id=?, test_status='CONFIRMED'
     WHERE id=? AND user_id=?`,
    [razorpay_payment_id, test_id, user.userId],
  );
  return json({ message: "DNA Test Payment Successful" });
});
