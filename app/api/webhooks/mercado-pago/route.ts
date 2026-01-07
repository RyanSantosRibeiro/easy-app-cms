import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("[v0] Mercado Pago Webhook received:", JSON.stringify(body, null, 2))

    // Validate webhook signature if configured
    // const signature = request.headers.get('x-signature')
    // const requestId = request.headers.get('x-request-id')

    // Handle different event types
    const { type, data } = body

    if (type === "payment") {
      await handlePaymentEvent(data)
    } else if (type === "subscription") {
      await handleSubscriptionEvent(data)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handlePaymentEvent(data: any) {
  const supabase = await createClient()

  console.log("[v0] Processing payment event:", data.id)

  // Get payment details from Mercado Pago API if needed
  // For now, we'll just log the event
  const paymentId = data.id

  // Update subscription based on payment status
  // This is a simplified version - you'd need to fetch full payment details
  // from Mercado Pago API using their SDK

  console.log("[v0] Payment processed:", paymentId)
}

async function handleSubscriptionEvent(data: any) {
  const supabase = await createClient()

  console.log("[v0] Processing subscription event:", data.id)

  const subscriptionId = data.id

  // Fetch subscription details from Mercado Pago API
  // In a real implementation, you'd use the Mercado Pago SDK:
  // const mercadoPagoSubscription = await mercadopago.subscription.get(subscriptionId)

  // For this example, we'll simulate the data structure
  const eventAction = data.action // 'created', 'updated', 'cancelled', etc.

  // Find the subscription in our database
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("mercado_pago_subscription_id", subscriptionId)
    .single()

  if (!subscription) {
    console.log("[v0] Subscription not found, creating new one")
    // Handle new subscription creation if needed
    return
  }

  // Update subscription status based on event
  let newStatus: "active" | "cancelled" | "expired" | "pending" = "active"

  switch (eventAction) {
    case "payment.created":
    case "payment.updated":
      newStatus = "active"
      break
    case "subscription.cancelled":
      newStatus = "cancelled"
      break
    case "subscription.paused":
      newStatus = "expired"
      break
    default:
      console.log("[v0] Unhandled action:", eventAction)
      return
  }

  // Update subscription in database
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
      ...(newStatus === "cancelled" && { cancelled_at: new Date().toISOString() }),
    })
    .eq("id", subscription.id)

  if (error) {
    console.error("[v0] Error updating subscription:", error)
    throw error
  }

  console.log("[v0] Subscription updated:", subscription.id, "New status:", newStatus)
}
