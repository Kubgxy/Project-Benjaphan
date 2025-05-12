import axios from "axios";

export async function createOrder(orderData: any) {
  try {
    const response = await axios.post("http://localhost:3000/api/order/createOrder", orderData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ API createOrder error:", error);
    return { success: false, error: "Failed to create order." };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const response = await axios.get(`http://localhost:3000/api/order/getOrderById/${orderId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ API getOrderById error:", error);
    return { success: false, error: "Failed to fetch order." };
  }
}