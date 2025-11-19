import { IOrder, IOrderUpdate } from "@/classes/Order";

export async function updateOrder(orderId: string, order: IOrderUpdate): Promise<IOrder> {
  try {
    const response = await fetch(`/api/v1/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la orden");
    }

    const data = await response.json();
    return data.body;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
} 