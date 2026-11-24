import { exec } from "@/lib/server/db";
import { isTestIdentifier } from "@/lib/server/testAuth";
import { handle, json, readJson } from "@/lib/server/http";

export const POST = handle(async (req) => {
  const { mobile_number } = await readJson(req);
  if (!mobile_number) return json({ message: "Mobile number required" }, 400);

  // Test account: OTP is fixed to 123456 (see lib/server/testAuth.ts)
  if (isTestIdentifier(mobile_number)) return json({ message: "OTP sent successfully" });

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
