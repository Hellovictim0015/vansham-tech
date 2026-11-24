import { query } from "@/lib/server/db";
import { handle, json } from "@/lib/server/http";

// Dev-only helper: lists OTPs so you can sign up without an SMS gateway.
export const GET = handle(async () => {
  if (process.env.NODE_ENV === "production")
    return json({ status: false, message: "Not found" }, 404);
  const rows = await query(
    "SELECT id, mobile_number, otp, expires_at, created_at FROM otps ORDER BY id DESC",
  );
  return json({ status: true, total: rows.length, data: rows });
});
