import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "@/lib/server/db";
import { handle, json, readJson, getJwtSecret } from "@/lib/server/http";

export const POST = handle(async (req) => {
  const { mobile_number, password } = await readJson(req);
  if (!mobile_number || !password)
    return json({ message: "Mobile number and password required" }, 400);

  const rows = await query("SELECT * FROM users WHERE mobile_number = ? AND role = 'admin'", [
    mobile_number,
  ]);
  if (rows.length === 0) return json({ message: "Admin not found" }, 401);
  const admin = rows[0];

  if (!(await bcrypt.compare(password, admin.password)))
    return json({ message: "Invalid password" }, 401);

  const token = jwt.sign({ userId: admin.id, id: admin.id, role: admin.role }, getJwtSecret(), {
    expiresIn: "7d",
  });
  return json({
    message: "Admin login successful",
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      mobile_number: admin.mobile_number,
      role: admin.role,
    },
  });
});
