import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "@/lib/server/db";
import { handle, json, readJson, getJwtSecret } from "@/lib/server/http";

export const POST = handle(async (req) => {
  const { mobile_number, password } = await readJson(req);
  if (!mobile_number || !password)
    return json({ message: "Mobile number and password are required" }, 400);

  const users = await query("SELECT * FROM users WHERE mobile_number = ?", [mobile_number]);
  if (users.length === 0) return json({ message: "User not found" }, 400);

  const user = users[0];
  if (!(await bcrypt.compare(password, user.password)))
    return json({ message: "Invalid password" }, 400);

  const token = jwt.sign({ userId: user.id }, getJwtSecret(), { expiresIn: "7d" });
  return json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      mobile_number: user.mobile_number,
      my_referral_code: user.my_referral_code,
      referral_status: Boolean(user.referral_status),
      payment: Boolean(user.payment),
    },
  });
});
