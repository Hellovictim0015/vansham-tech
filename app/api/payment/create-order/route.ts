import { protect, json, readJson } from "@/lib/server/http";
import { getRazorpay } from "@/lib/server/razorpay";

export const POST = protect(async (req) => {
  const { amount } = await readJson(req);
  if (!amount || amount <= 0) return json({ message: "Valid amount is required" }, 400);

  const order = await getRazorpay().orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });
  return json(order);
});
