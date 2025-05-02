"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/actions/order-actions";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, MapPinHouse, Package, Banknote } from "lucide-react";

export function CheckoutForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(50);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    if (!isShippingInfoValid()) {
      setShowShippingModal(true);
      modalRef.current?.showModal();
    }
  }, []); // ✅ แก้เป็น [] เพื่อให้เช็กครั้งแรกตอนเข้าหน้า

  const isShippingInfoValid = () => {
    return (
      shippingInfo.firstName.trim() &&
      shippingInfo.lastName.trim() &&
      shippingInfo.phone.trim() &&
      shippingInfo.address.trim() &&
      shippingInfo.city.trim() &&
      shippingInfo.state.trim() &&
      shippingInfo.postalCode.trim()
    );
  };

  const handleSaveShipping = () => {
    setShowShippingModal(false);
    modalRef.current?.close();
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/checkout/summary", {
        withCredentials: true,
      })
      .then((res) => {
        setCheckoutItems(res.data.items);
        setSubtotal(res.data.subtotal);
        setShipping(res.data.shipping);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.error("❌ Failed to load checkout summary:", err);
        router.push("/cart");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        items: checkoutItems,
        subtotal,
        shipping,
        total,
        shippingInfo,
        paymentMethod,
      };

      const result = await createOrder(orderData);

      if (result.success) {
        router.push(`/payment?orderId=${result.orderId}`);
      } else {
        setError(result.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">กำลังโหลด...</div>;
  }

  if (checkoutItems.length === 0) {
    return <div className="text-center py-12">ไม่มีสินค้าในตะกร้า</div>;
  }

  return (
    <div className="container mx-auto p-4  max-w-6xl">
      <h1 className="flex items-center gap-2 text-3xl font-display font-medium text-brown-800 mb-8">
        <ShoppingCart className="w-8 h-8 text-yellow-500" />
        ทำการสั่งซื้อ
      </h1>
      {/* MODAL ส่วนกรอกที่อยู่ */}
      <dialog
        ref={modalRef}
        className="rounded-lg p-6 w-full max-w-3xl z-50 bg-white shadow-lg"
      >
        <h2 className="flex gap-2 text-lg font-semibold mb-4 text-brown-800">
          <MapPinHouse className="w-6 h-6 text-yellow-500" />
          กรอกที่อยู่จัดส่ง
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">ชื่อ</label>
            <input
              type="text"
              placeholder="กรอกชื่อ"
              value={shippingInfo.firstName}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, firstName: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">นามสกุล</label>
            <input
              type="text"
              placeholder="กรอกนามสกุล"
              value={shippingInfo.lastName}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, lastName: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">เบอร์โทร</label>
            <input
              type="number"
              placeholder="กรอกเบอร์โทร"
              value={shippingInfo.phone}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, phone: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ที่อยู่</label>
            <input
              type="text"
              placeholder="กรอกที่อยู่"
              value={shippingInfo.address}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, address: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">เขต/อำเภอ</label>
            <input
              type="text"
              placeholder="กรอกเขต/อำเภอ"
              value={shippingInfo.city}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, city: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">จังหวัด</label>
            <input
              type="text"
              placeholder="กรอกจังหวัด"
              value={shippingInfo.state}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, state: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              รหัสไปรษณีย์
            </label>
            <input
              type="number"
              placeholder="กรอกรหัสไปรษณีย์"
              value={shippingInfo.postalCode}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, postalCode: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <button
          onClick={handleSaveShipping}
          className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
        >
          บันทึกที่อยู่
        </button>
      </dialog>

      {/* ส่วนแสดงที่อยู่ */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="flex gap-2 text-lg font-semibold text-brown-800 items-center">
            <MapPinHouse className="w-6 h-6 text-yellow-500" />
            กรอกที่อยู่จัดส่ง
          </h2>
          {!shippingInfo.firstName ||
          !shippingInfo.phone ||
          !shippingInfo.address ? (
            <button
              className="bg-yellow-500 hover:bg-yellow-600  text-white text-sm px-4 py-2 rounded transition"
              onClick={() => {
                setShowShippingModal(true);
                modalRef.current?.showModal();
              }}
            >
              เพิ่มที่อยู่
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded transition"
              onClick={() => {
                setShowShippingModal(true);
                modalRef.current?.showModal();
              }}
            >
              เปลี่ยนที่อยู่
            </button>
          )}
        </div>

        {/* ส่วนข้อความเตือนหรือแสดงข้อมูล */}
        {!shippingInfo.firstName ||
        !shippingInfo.phone ||
        !shippingInfo.address ? (
          <p className="text-red-500 text-sm mb-2">
            ⚠ กรุณากรอกที่อยู่เพื่อจัดส่งสินค้า
          </p>
        ) : (
          <div className="mb-2">
            <p className="font-medium">
              {shippingInfo.firstName} {shippingInfo.lastName} |{" "}
              {shippingInfo.phone}
            </p>
            <p className="text-sm text-gray-700">
              {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state},{" "}
              {shippingInfo.postalCode}
            </p>
          </div>
        )}
      </div>

      {/* รายการสินค้า */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-2 text-brown-800">
          <Package className="w-5 h-5 text-yellow-500" />
          สินค้าที่สั่งซื้อแล้ว
        </h2>
        {checkoutItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between py-2 border-b"
          >
            <div className="flex w-auto h-auto items-center">
              <Image
                src={
                  item.images?.[0]
                    ? `http://localhost:3000${item.images[0]}`
                    : "/placeholder.svg"
                }
                alt={item.name}
                width={64}
                height={64}
                className="object-cover mr-4"
                priority
              />
              <div>
                <p className="font-medium text-brown-800">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ขนาด: {item.size} | จำนวน: {item.quantity}
                </p>
              </div>
            </div>
            <p className="font-medium">{formatPrice(item.price)}</p>
          </div>
        ))}
      </div>

      {/* สรุปยอดสั่งซื้อ */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex justify-between mb-2 ">
          <span className="text-brown-800">ราคารวมสินค้า</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-brown-800">ค่าจัดส่ง</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
          <div className="flex items-center gap-2 text-brown-800">
            <Banknote className="w-6 h-6 text-yellow-500" />
            ยอดชำระทั้งหมด
          </div>
          <span className="text-red-500">{formatPrice(total)}</span>
        </div>
      </div>

      {/* ปุ่มยืนยัน */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <Button
        onClick={handlePlaceOrder}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded text-lg font-semibold"
        disabled={isSubmitting || !isShippingInfoValid()}
      >
        {isSubmitting ? "กำลังประมวลผล..." : "ยืนยันคำสั่งซื้อ"}
      </Button>
    </div>
  );
}
