"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, CreditCard, Truck, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { createOrder } from "@/actions/order-actions"
import { formatPrice } from "@/lib/utils"

type CheckoutStep = "shipping" | "payment" | "review"

export function CheckoutForm() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shipping = 15
  const tax = subtotal * 0.07
  const total = subtotal + shipping + tax

  // Form data
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep("payment")
    window.scrollTo(0, 0)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep("review")
    window.scrollTo(0, 0)
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        subtotal,
        shipping,
        tax,
        total,
        shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          // Mask card number for security
          cardNumber: `**** **** **** ${paymentInfo.cardNumber.slice(-4)}`,
        },
      }

      // Create form data for server action
      const formData = new FormData()
      formData.append("orderData", JSON.stringify(orderData))

      // Submit order
      const result = await createOrder(formData)

      if (result.success) {
        // Clear cart and redirect to success page
        clearCart()
        router.push(`/order-confirmation?orderId=${result.orderId}`)
      } else {
        setError(result.error || "An error occurred while processing your order. Please try again.")
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error("Error placing order:", err)
      setError("An error occurred while processing your order. Please try again.")
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-medium text-gray-900 mb-8">Checkout</h1>

      {/* Checkout Steps */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center w-full max-w-3xl">
          <div
            className={`flex flex-col items-center ${currentStep === "shipping" ? "text-gold-600" : "text-gray-400"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep === "shipping"
                  ? "bg-gold-600 text-white"
                  : currentStep === "payment" || currentStep === "review"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
              }`}
            >
              {currentStep === "payment" || currentStep === "review" ? (
                <Check className="h-5 w-5" />
              ) : (
                <Truck className="h-5 w-5" />
              )}
            </div>
            <span className="text-sm">Shipping</span>
          </div>

          <div className={`flex-1 h-1 mx-2 ${currentStep === "shipping" ? "bg-gray-200" : "bg-gold-600"}`}></div>

          <div
            className={`flex flex-col items-center ${
              currentStep === "payment"
                ? "text-gold-600"
                : currentStep === "review"
                  ? "text-green-500"
                  : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep === "payment"
                  ? "bg-gold-600 text-white"
                  : currentStep === "review"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
              }`}
            >
              {currentStep === "review" ? <Check className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
            </div>
            <span className="text-sm">Payment</span>
          </div>

          <div
            className={`flex-1 h-1 mx-2 ${
              currentStep === "shipping" || currentStep === "payment" ? "bg-gray-200" : "bg-gold-600"
            }`}
          ></div>

          <div className={`flex flex-col items-center ${currentStep === "review" ? "text-gold-600" : "text-gray-400"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep === "review" ? "bg-gold-600 text-white" : "bg-gray-200"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-sm">Review</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Shipping Information Form */}
          {currentStep === "shipping" && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-display font-medium mb-6">Shipping Information</h2>

                <form onSubmit={handleShippingSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/Province *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        required
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        required
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Japan">Japan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mt-6">
                    <Button type="submit" variant="luxury" size="lg">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Payment Information Form */}
          {currentStep === "payment" && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-display font-medium mb-6">Payment Information</h2>

                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="0000 0000 0000 0000"
                      required
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      required
                      value={paymentInfo.cardHolder}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        placeholder="MM/YY"
                        required
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        placeholder="123"
                        required
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center mt-6 space-x-4">
                    <Button type="button" variant="outline" size="lg" onClick={() => setCurrentStep("shipping")}>
                      Back
                    </Button>
                    <Button type="submit" variant="luxury" size="lg">
                      Review Order
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Order Review */}
          {currentStep === "review" && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-display font-medium mb-6">Review Your Order</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p>
                      {shippingInfo.firstName} {shippingInfo.lastName}
                    </p>
                    <p>{shippingInfo.address}</p>
                    <p>
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}
                    </p>
                    <p>{shippingInfo.country}</p>
                    <p>Email: {shippingInfo.email}</p>
                    <p>Phone: {shippingInfo.phone}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p>Credit/Debit Card</p>
                    <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                    <p>Expires: {paymentInfo.expiryDate}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Order Items</h3>
                  <div className="border-t border-b border-gray-200">
                    {items.map((item) => (
                      <div key={item.product.id} className="py-4 flex items-center">
                        <div className="relative w-16 h-16 mr-4 bg-gray-50">
                          <Image
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          {item.selectedSize && <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>}
                          {item.selectedColor && <p className="text-xs text-gray-500">Color: {item.selectedColor}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                <form onSubmit={handlePlaceOrder}>
                  <div className="flex items-center mt-6 space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setCurrentStep("payment")}
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                    <Button type="submit" variant="luxury" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center">
                    <div className="relative w-12 h-12 mr-3 bg-gray-50">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{item.product.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

