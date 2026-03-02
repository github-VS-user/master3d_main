import { NextResponse } from "next/server"

async function sendTelegram(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token || !chatId) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_number, customer_name, customer_phone, customer_address, payment_method, total, items } = body

    const itemLines = items
      .map((i: { product_name: string; quantity: number; price: number }) =>
        `  • ${i.product_name} x${i.quantity} — CHF ${(Number(i.price) * i.quantity).toFixed(2)}`
      )
      .join("\n")

    const message = [
      `<b>New Order #${order_number}</b>`,
      ``,
      `<b>Customer:</b> ${customer_name}`,
      customer_phone ? `<b>Phone:</b> ${customer_phone}` : null,
      `<b>Address:</b> ${customer_address}`,
      `<b>Payment:</b> ${payment_method}`,
      ``,
      `<b>Items:</b>`,
      itemLines,
      ``,
      `<b>Total: CHF ${Number(total).toFixed(2)}</b>`,
    ]
      .filter((l) => l !== null)
      .join("\n")

    const chatId1 = process.env.TELEGRAM_CHAT_ID_1
    const chatId2 = process.env.TELEGRAM_CHAT_ID_2

    await Promise.all([
      chatId1 ? sendTelegram(chatId1, message) : Promise.resolve(),
      chatId2 ? sendTelegram(chatId2, message) : Promise.resolve(),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Telegram notification error:", error)
    return NextResponse.json({ error: "Notification failed" }, { status: 500 })
  }
}
