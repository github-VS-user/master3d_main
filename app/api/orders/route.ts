import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

function generateOrderNumber(): string {
  // Generate a unique 3-digit order number
  const num = Math.floor(100 + Math.random() * 900)
  return String(num)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer_name, customer_phone, customer_address, items, total } = body

    if (!customer_name || !customer_phone || !customer_address || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Generate a unique order number (retry if collision)
    let orderNumber = generateOrderNumber()
    let attempts = 0
    while (attempts < 20) {
      const { data: existing } = await supabase
        .from("orders")
        .select("id")
        .eq("order_number", orderNumber)
        .maybeSingle()
      if (!existing) break
      orderNumber = generateOrderNumber()
      attempts++
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_phone,
        customer_address,
        total,
        is_paid: false,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: { product_id: string; product_name: string; quantity: number; price: number; shipping_time: string }) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      shipping_time: item.shipping_time,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Send notification email and SMS (fire-and-forget)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: orderNumber,
          customer_name,
          customer_phone,
          total,
          items,
        }),
      }).catch(() => {})
    } catch {
      // notification failures should not block order creation
    }

    return NextResponse.json({ order_number: orderNumber, order_id: order.id })
  } catch (error) {
    console.error("Orders API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
