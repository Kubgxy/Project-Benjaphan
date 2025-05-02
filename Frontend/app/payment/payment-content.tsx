"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Banknote, QrCode, CheckCircle } from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [paymentMethod, setPaymentMethod] = useState<"bank" | "qr">("bank");
  const [orderData, setOrderData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      //   router.push("/cart");
      return;
    }
    axios
      .get(`http://localhost:3000/api/order/getOrderById/${orderId}`, {
        withCredentials: true,
      })
      .then((res) => setOrderData(res.data))
      .catch((err) => {
        console.error("Failed to load order:", err);
        // router.push("/cart");
      });
  }, [orderId, router]);

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await axios.post(
        `http://localhost:3000/api/payments`,
        {
          orderId,
          paymentMethod,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        router.push(`/order-confirmation?orderId=${orderId}`);
      } else {
        setError(res.data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error confirming payment:", err);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      setIsSubmitting(false);
    }
  };

  if (!orderData) {
    return (
      <div className="text-center py-12">กำลังโหลดข้อมูลการสั่งซื้อ...</div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl ">
  <h1 className="flex items-center gap-2 text-3xl font-bold text-yellow-600 mb-6">
    <Banknote className="w-8 h-8" />
    ชำระเงินคำสั่งซื้อ
  </h1>

  {/* รายละเอียดคำสั่งซื้อ */}
  <div className="bg-white rounded-lg shadow-md p-6 mb-6 ">
    <h2 className="text-lg font-semibold text-yellow-600 mb-4 border-b pb-2">
      รายละเอียดคำสั่งซื้อ
    </h2>

    {orderData.items.map((item: any) => (
      <div key={item.productId} className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Image
            src={`http://localhost:3000${item.images?.[0] || "/placeholder.svg"}`}
            alt={item.name}
            width={80}
            height={80}
            className="rounded-lg border object-cover"
          />
          <div>
            <p className="font-medium text-brown-800">{item.name}</p>
            <p className="text-sm text-gray-500">
              ขนาด: {item.size} | จำนวน: {item.quantity}
            </p>
          </div>
        </div>
        <p className="font-semibold text-brown-700">{item.price.toLocaleString()} บาท</p>
      </div>
    ))}

    <div className="border-t pt-4 mt-4 space-y-1 text-sm text-gray-700">
      <p>ที่อยู่จัดส่ง: <span className="font-semibold text-yellow-700">{orderData.shippingInfo.address}, {orderData.shippingInfo.city}, {orderData.shippingInfo.state}, {orderData.shippingInfo.postalCode}</span></p>
      <p>เลขคำสั่งซื้อ: <span className="text-yellow-700">{orderId}</span></p>
      <p>ราคา: {orderData.subtotal.toLocaleString()} บาท</p>
      <p>ค่าจัดส่ง: {orderData.shippingFee.toLocaleString()} บาท</p>
      <p className="text-lg font-bold text-red-500">ยอดที่ต้องชำระ: {orderData.total.toLocaleString()} บาท</p>
    </div>
  </div>

  {/* วิธีการชำระเงิน */}
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-lg font-semibold text-yellow-600 mb-4 border-b pb-2">
      <QrCode className="inline w-5 h-5 mr-1" />
      เลือกวิธีการชำระเงิน
    </h2>

    <div className="flex gap-4 mb-4">
      <button
        className={`flex-1 px-4 py-2 rounded-lg transition ${
          paymentMethod === "bank"
            ? "bg-yellow-500 text-white shadow"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() => setPaymentMethod("bank")}
      >
        โอนผ่านบัญชีธนาคาร
      </button>
      <button
        className={`flex-1 px-4 py-2 rounded-lg transition ${
          paymentMethod === "qr"
            ? "bg-yellow-500 text-white shadow"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        onClick={() => setPaymentMethod("qr")}
      >
        สแกน QR Code
      </button>
    </div>

    {paymentMethod === "bank" ? (
      <div className="space-y-1 text-sm text-gray-700">
        <p><span className="font-medium">ธนาคารไทยพาณิชย์</span></p>
        <p>เลขบัญชี: <span className="font-medium">123-456-7890</span></p>
        <p>ชื่อบัญชี: <span className="font-medium">บริษัท เบญจภัณฑ์๕ จำกัด</span></p>
        <p className="text-gray-500 text-xs">หลังโอนเสร็จ กรุณากด “ยืนยันการชำระเงิน”</p>
      </div>
    ) : (
      <div className="space-y-2 text-center">
        <Image src="/qrcode-sample.png" alt="QR Code" width={160} height={160} className="mx-auto" />
        <p className="text-gray-500 text-xs">หลังสแกนเสร็จ กรุณากด “ยืนยันการชำระเงิน”</p>
      </div>
    )}
  </div>

  {error && (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg shadow">
      {error}
    </div>
  )}

  <Button
    onClick={handleConfirmPayment}
    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md transition"
    disabled={isSubmitting}
  >
    {isSubmitting ? "กำลังประมวลผล..." : "ยืนยันการชำระเงิน"}
  </Button>
</div>

  );
}
