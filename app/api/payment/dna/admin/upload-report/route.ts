import { exec } from "@/lib/server/db";
import { protect, json } from "@/lib/server/http";
import { uploadFile, MAX_UPLOAD_BYTES } from "@/lib/server/storage";

// Admin only (the original Express route had no auth at all).
export const POST = protect(async (req, user) => {
  if (user.role !== "admin") return json({ success: false, message: "Forbidden" }, 403);

  const form = await req.formData();
  const order_id = form.get("order_id");
  const file = form.get("report");
  if (!order_id || !(file instanceof File) || file.size === 0)
    return json({ success: false, message: "order_id and report file required" }, 400);
  if (file.size > MAX_UPLOAD_BYTES) return json({ success: false, message: "File exceeds 5 MB" }, 400);

  const url = await uploadFile(file, "dna-reports");
  await exec("UPDATE dna_orders SET report_pdf=?, order_status='report_ready' WHERE id=?", [
    url,
    order_id,
  ]);
  return json({ success: true, message: "Report uploaded" });
});
