"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Check, Package, Truck, Home } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getOrder } from "@/actions/order-actions"
import { formatPrice } from "@/lib/utils"

export default function OrderTrackingPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Mock tracking status
  const [trackingStatus, setTrackingStatus] = useState({
    status: "processing",
    steps: [
      {
        name: "Order Confirmed",
        status: "complete",
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        icon: Check,
      },
      { name: "Processing Order", status: "current", date: "", icon: Package },
      { name: "Shipped", status: "upcoming", date: "", icon: Truck },
      { name: "Delivered", status: "upcoming", date: "", icon: Home },
    ],
  })

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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="w-16 h-16 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order information...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-display font-medium text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
          <Button variant="luxury" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-medium text-gray-900 mb-8">Track Your Order</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Order #{orderId}</h2>
                <span className="px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-sm">Processing</span>
              </div>

              <div className="mb-8">
                <div className="relative">
                  {trackingStatus.steps.map((step, index) => (
                    <div key={index} className="relative mb-8 last:mb-0">
                      <div className="flex items-start">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center z-10 mr-4 ${
                            step.status === "complete"
                              ? "bg-green-500 text-white"
                              : step.status === "current"
                                ? "bg-gold-600 text-white"
                                : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step.status === "complete" ? (
                            <Check className="h-6 w-6" />
                          ) : (
                            <step.icon className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">{step.name}</h3>
                          {step.date && <p className="text-sm text-gray-600">{step.date}</p>}
                          {step.status === "current" && <p className="text-sm text-gold-600 mt-1">In progress</p>}
                        </div>
                      </div>
                      {index < trackingStatus.steps.length - 1 && (
                        <div
                          className={`absolute left-6 top-12 h-12 w-0.5 ${
                            step.status === "complete" ? "bg-green-500" : "bg-gray-200"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium mb-4">Order Items</h3>

                <div className="space-y-4">
                  {order.details.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="relative w-16 h-16 bg-gray-50 mr-4">
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        {item.selectedSize && <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>}
                        {item.selectedColor && <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.details.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(order.details.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(order.details.tax)}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(order.details.total)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                <div className="text-sm text-gray-600">
                  <p>
                    {order.details.shippingInfo.firstName} {order.details.shippingInfo.lastName}
                  </p>
                  <p>{order.details.shippingInfo.address}</p>
                  <p>
                    {order.details.shippingInfo.city}, {order.details.shippingInfo.state}{" "}
                    {order.details.shippingInfo.postalCode}
                  </p>
                  <p>{order.details.shippingInfo.country}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

