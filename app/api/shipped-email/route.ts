import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { to, customer_name, order_number, order_id, estimated_days_min, estimated_days_max } = await request.json()

    if (!to || !order_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error("[v0] RESEND_API_KEY not set")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const requestUrl = new URL(request.url)
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`
    const invoiceUrl = `${baseUrl}/invoice/${order_id}`

    const daysLabel =
      estimated_days_min && estimated_days_max
        ? `${estimated_days_min}–${estimated_days_max} business days`
        : estimated_days_min
        ? `${estimated_days_min}+ business days`
        : "2–5 business days"

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Your Order Has Shipped — Master 3D</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#111827;padding:32px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Master 3D</h1>
      <p style="margin:6px 0 0;color:#9ca3af;font-size:14px;">Swiss 3D Printing</p>
    </div>

    <div style="padding:40px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
        <div style="width:48px;height:48px;background:#dbeafe;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:22px;">
          &#128666;
        </div>
        <div>
          <h2 style="margin:0;color:#111827;font-size:20px;font-weight:700;">Your order is on its way!</h2>
          <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Hi ${customer_name}, your order has been shipped.</p>
        </div>
      </div>

      <div style="background:#f3f4f6;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#6b7280;">Order number</p>
        <p style="margin:4px 0 0;font-size:24px;font-weight:700;color:#111827;letter-spacing:1px;">#${order_number}</p>
      </div>

      <div style="border:1px solid #bfdbfe;background:#eff6ff;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#1e40af;">Estimated delivery</p>
        <p style="margin:0;font-size:15px;font-weight:700;color:#1d4ed8;">${daysLabel}</p>
        <p style="margin:8px 0 0;font-size:12px;color:#3b82f6;">Delivery times are estimated and may vary depending on your location within Switzerland.</p>
      </div>

      <div style="text-align:center;margin-bottom:32px;">
        <a href="${invoiceUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">View Invoice</a>
      </div>

      <p style="margin:0;font-size:13px;color:#6b7280;text-align:center;">
        Questions? Email us at <a href="mailto:contact@master3d.net" style="color:#111827;">contact@master3d.net</a>
      </p>
    </div>

    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Master 3D &bull; Switzerland &bull; <a href="https://master3d.net" style="color:#9ca3af;">master3d.net</a></p>
    </div>
  </div>
</body>
</html>`

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Master 3D <orders@master3d.net>",
        to: [to],
        subject: `Your order #${order_number} has shipped — Master 3D`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("[v0] Resend shipped-email error:", err)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    console.log(`[v0] Shipped email sent to ${to} for order #${order_number}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] shipped-email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
