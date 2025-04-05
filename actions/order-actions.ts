"use server"

import { revalidatePath } from "next/cache"
import { createOrder as createOrderInDb, getOrder as getOrderFromDb } from "@/lib/data"
import type { OrderDetails } from "@/lib/types"

export async function createOrder(formData: FormData): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // In a real app, you would validate the form data and process payment
    const orderData = JSON.parse(formData.get("orderData") as string) as OrderDetails

    // Wait for 1 second to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create order in database
    const result = createOrderInDb(orderData)

    // Revalidate the orders page
    revalidatePath("/orders")
    revalidatePath("/order-confirmation")
    revalidatePath("/order-tracking")

    return result
  } catch (error) {
    console.error("Error creating order:", error)
    return {
      success: false,
      error: "Failed to process your order. Please try again.",
    }
  }
}

export async function getOrder(orderId: string) {
  // In a real app, this would fetch from a database
  return getOrderFromDb(orderId)
}

