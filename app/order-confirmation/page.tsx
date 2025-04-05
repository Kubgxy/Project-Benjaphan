"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getOrder } from "@/actions/order-actions"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (orderId) {
        try {
          const orderData = await getOrder(orderId)
          setOrder(orderData)
        } catch (error) {
          console.error("Error fetching order:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order information...</p>
          </div>
        ) : !orderId || !order ? (
          <div className="text-center py-12">
            <h1 className="text-3xl font-display font-medium text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
            <Button variant="luxury" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8" />
              </div>

              <h1 className="text-3xl font-display font-medium text-gray-900 mb-4">Thank You for Your Order!</h1>
              <p className="text-gray-600 mb-6">Your order has been confirmed and is now being processed.</p>

              <div className="border-t border-b border-gray-200 py-4 mb-6">
                <p className="text-gray-600">
                  Order Number: <span className="font-medium text-gray-900">{orderId}</span>
                </p>
              </div>

              <p className="text-gray-600 mb-8">
                We've sent a confirmation email to {order.details.shippingInfo.email} with your order details and
                tracking information.
              </p>

              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="luxury" asChild>
                  <Link href={`/order-tracking?orderId=${orderId}`}>Track Your Order</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

