"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, Package, Truck, Home } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/actions/order-actions";
import { formatPrice } from "@/lib/utils";
import Swal from "sweetalert2";

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ คำนวณราคารวมสินค้า (subtotal)
  const subtotal =
    order?.items?.reduce(
      (sum: number, item: any) => sum + item.priceAtPurchase * item.quantity,
      0
    ) || 0;

  const shippingFee = order?.total ? order.total - subtotal : 50;

  // ✅ แปลงสถานะเป็น Step
  const getTrackingSteps = (status: string) => {
    const steps = [
      { name: "ยืนยันคำสั่งซื้อ", icon: Check },
      { name: "กำลังเตรียมสินค้า", icon: Package },
      { name: "กำลังจัดส่ง", icon: Truck },
      { name: "จัดส่งเรียบร้อยแล้ว", icon: Home },
    ];

    let currentStep = 0;
    switch (status) {
      case "pending":
        currentStep = 0;
        break;
      case "confirmed":
        currentStep = 1;
        break;
      case "shipped":
        currentStep = 2;
        break;
      case "delivered":
        currentStep = 4;
        break;
      default:
        currentStep = 0;
    }

    return steps.map((step, index) => ({
      ...step,
      status:
        index < currentStep
          ? "complete"
          : index === currentStep
          ? "current"
          : "upcoming",
    }));
  };

  useEffect(() => {
    async function fetchOrder() {
      if (orderId) {
        try {
          const res = await getOrderById(orderId);
          if (res?.success) {
            setOrder(res.order);
          }
        } catch (error) {
          console.error("Error fetching order:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      title: "ยืนยันการยกเลิก",
      text: "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำสั่งซื้อนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/order/cancelOrder/${orderId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        Swal.fire("สำเร็จ!", "คำสั่งซื้อถูกยกเลิกแล้ว", "success");
        window.location.reload();
      } else {
        Swal.fire("ผิดพลาด", data.message || "ไม่สามารถยกเลิกได้", "error");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      Swal.fire("ผิดพลาด", "เกิดข้อผิดพลาด กรุณาลองใหม่", "error");
    }
  };

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
    );
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-display font-medium text-gray-900 mb-4">
            ไม่พบคำสั่งซื้อ
          </h1>
          <p className="text-gray-600 mb-8">
            เราไม่พบคำสั่งซื้อที่คุณกำลังค้นหา กรุณาตรวจสอบอีกครั้ง
          </p>
          <Button variant="luxury" asChild>
            <Link href="/">กลับสู่หน้าหลัก</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const steps = getTrackingSteps(order.orderStatus);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-display font-medium text-brown-800 mb-8">
          ติดตามคำสั่งซื้อ
        </h1>

        {/* ✅ Tracking Steps */}
        <div className="rounded-lg  overflow-hidden p-6 mb-8">
          <h3 className="text-lg font-medium mb-6 text-center">
            สถานะการจัดส่ง
          </h3>

          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                {/* ✅ จุด (Circle) */}
                <div className={`flex flex-col items-center`}>
                  <div
                    className={`flex items-center justify-center h-24 w-24 rounded-full z-10
              ${
                step.status === "complete"
                  ? "bg-green-500 text-white"
                  : step.status === "current"
                  ? "bg-gold-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
                  >
                    <step.icon className="h-16 w-16" />
                  </div>
                  <span className="text-sm mt-2 text-center w-24">
                    {step.name}
                  </span>
                  {step.status === "current" && (
                    <p
                      className={`text-xs mt-1 ${
                        index === steps.length - 1
                          ? "text-green-600 font-medium"
                          : "text-gold-600"
                      }`}
                    >
                      {index === steps.length - 1
                        ? "เสร็จสิ้น"
                        : "กำลังดำเนินการ"}
                    </p>
                  )}
                </div>

                {/* ✅ เส้นเชื่อมต่อ (ไม่ต้องใส่หลังอันสุดท้าย) */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2
              ${step.status === "complete" ? "bg-green-500" : "bg-gray-200"}`}
                    style={{ minWidth: "150px" }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          {/* ✅ Order Info */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">
                เลขคำสั่งซื้อ: {order._id}
              </h2>
              <span className="px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-sm capitalize">
                {order.orderStatus}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              วันที่สั่งซื้อ:{" "}
              {new Date(order.createdAt).toLocaleDateString("th-TH")}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              การชำระเงิน: {order.payment?.method} | สถานะ:{" "}
              {order.payment?.status}
            </p>
            {order.deliveryTracking?.trackingNumber && (
              <p className="text-sm text-gray-600">
                Tracking: {order.deliveryTracking.trackingNumber}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">ที่อยู่จัดส่ง</h3>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>
                <strong>ชื่อผู้รับ:</strong>{" "}
                {order.userId?.firstName && order.userId?.lastName
                  ? `${order.userId.firstName} ${order.userId.lastName}`
                  : "ไม่พบข้อมูล"}
              </p>
              <p>
                <strong>เบอร์โทร:</strong>{" "}
                {order.userId?.phoneNumber || "ไม่พบข้อมูล"}
              </p>
              <p>
                <strong>ที่อยู่:</strong> {order.shippingInfo.addressLine},{" "}
                {order.shippingInfo.city}, {order.shippingInfo.province},{" "}
                {order.shippingInfo.postalCode} {order.shippingInfo.country}
              </p>
            </div>
          </div>

          {/* ✅ Order Items */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
            <h3 className="text-lg font-medium mb-4">สินค้าที่สั่งซื้อ</h3>
            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="relative w-16 h-16 bg-gray-50 mr-4">
                    <Image
                      src={`http://localhost:3000${item.images[0]}`}
                      alt={item.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      จำนวน: {item.quantity} | ไซส์: {item.size}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(item.priceAtPurchase * item.quantity)} บาท
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <span>ราคารวมสินค้า:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>ค่าจัดส่ง:</span>
              <span>{formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>ยอดรวมทั้งหมด:</span>
              <span>{formatPrice(order.total)} บาท</span>
            </div>
          </div>
        </div>
        <div
          className={`flex gap-4 mt-4 ${
            order.orderStatus !== "pending" ? "justify-end" : ""
          }`}
        >
          {/* ✅ เงื่อนไขแสดงปุ่มเฉพาะตอน pending */}
          {order.orderStatus === "pending" && (
            <Button
              onClick={handleCancelOrder}
              className="flex-1 bg-gray-300 hover:bg-gray-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md transition"
              disabled={isSubmitting}
            >
              ยกเลิกคำสั่งซื้อ
            </Button>
          )}

          <Button
            className={`${
              order.orderStatus === "pending" ? "flex-1" : ""
            } bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition`}
          >
            <Link href="/products">เลือกซื้อสินค้าต่อ</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
