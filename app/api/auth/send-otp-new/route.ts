import { exec } from "@/lib/server/db";
import { handle, json, readJson } from "@/lib/server/http";

export const POST = handle(async (req) => {
  const { mobile_number } = await readJson(req);
  if (!mobile_number) return json({ message: "Mobile number required" }, 400);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await exec("INSERT INTO otps (mobile_number, otp, expires_at) VALUES (?, ?, ?)", [
    mobile_number,
    otp,
    expiresAt,
  ]);
  console.log("OTP (DEV):", otp); // integrate SMS provider here
  return json({ message: "OTP sent successfully" });
});
