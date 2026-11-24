import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { exec, query } from "@/lib/server/db";
import { handle, json, readJson, getJwtSecret } from "@/lib/server/http";

async function generateReferralCode() {
  for (;;) {
    const code = `VAN${Math.floor(100000 + Math.random() * 900000)}`;
    const rows = await query("SELECT id FROM users WHERE my_referral_code = ?", [code]);
    if (rows.length === 0) return code;
  }
}

export const POST = handle(async (req) => {
  const { name, mobile_number, otp, password } = await readJson(req);
  if (!name || !mobile_number || !otp || !password)
    return json({ message: "All fields are required" }, 400);

  const otpRows = await query(
    `SELECT id FROM otps WHERE mobile_number = ? AND otp = ? AND expires_at > NOW()
     ORDER BY id DESC LIMIT 1`,
    [mobile_number, otp],
  );
  if (otpRows.length === 0) return json({ message: "Invalid or expired OTP" }, 400);

  const exist = await query("SELECT id FROM users WHERE mobile_number = ?", [mobile_number]);
  if (exist.length > 0) return json({ message: "User already registered" }, 400);

  const hashed = await bcrypt.hash(password, 10);
  const myReferralCode = await generateReferralCode();
  const result = await exec(
    `INSERT INTO users (name, mobile_number, password, my_referral_code, referral_status, payment)
     VALUES (?, ?, ?, ?, 0, 0)`,
    [name, mobile_number, hashed, myReferralCode],
  );
  await exec("DELETE FROM otps WHERE mobile_number = ?", [mobile_number]);

  const token = jwt.sign({ userId: result.insertId }, getJwtSecret(), { expiresIn: "7d" });
  return json(
    {
      message: "Registration successful",
      token,
      user: {
        id: result.insertId,
        name,
        mobile_number,
        my_referral_code: myReferralCode,
        referral_status: false,
        payment: false,
      },
    },
    201,
  );
});
