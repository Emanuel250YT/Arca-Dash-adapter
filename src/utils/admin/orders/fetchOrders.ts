import { IOrder } from "@/classes/Order";

interface FetchOrdersResponse {
  orders: IOrder[];
  totalPages: number;
}

export async function fetchOrders(
  page: number,
  limit: number,
  filters: { contain: string }
): Promise<FetchOrdersResponse> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters.contain) {
      queryParams.append("contain", filters.contain);
    }

    const response = await fetch(`/api/v1/orders?${queryParams}`);

    if (!response.ok) {
      throw new Error("Error al obtener las órdenes");
    }

    const data = await response.json();

    return {
      orders: data.body.content,
      totalPages: data.body.totalPages,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
} 