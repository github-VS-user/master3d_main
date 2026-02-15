import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_number, customer_name, customer_phone, total, items } = body

    // Log notification for now - integrate with email/SMS provider later
    console.log("=== NEW ORDER NOTIFICATION ===")
    console.log(`Order #${order_number}`)
    console.log(`Customer: ${customer_name} (${customer_phone})`)
    console.log(`Total: CHF ${Number(total).toFixed(2)}`)
    console.log(`Items: ${items.map((i: { product_name: string; quantity: number }) => `${i.product_name} x${i.quantity}`).join(", ")}`)
    console.log(`Email: dariodibonaoff@gmail.com`)
    console.log(`SMS: +41 78 251 47 68`)
    console.log("==============================")

    // TODO: Integrate email service (e.g., Resend, SendGrid)
    // await sendEmail({
    //   to: "dariodibonaoff@gmail.com",
    //   subject: `New Order #${order_number}`,
    //   body: `New order from ${customer_name}...`,
    // })

    // TODO: Integrate SMS service (e.g., Twilio)
    // await sendSMS({
    //   to: "+41782514768",
    //   body: `New order #${order_number} from ${customer_name} - CHF ${total}`,
    // })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Notification failed" }, { status: 500 })
  }
}
