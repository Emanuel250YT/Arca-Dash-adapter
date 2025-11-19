export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/v1/order/${orderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la orden");
    }

    return true;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}
