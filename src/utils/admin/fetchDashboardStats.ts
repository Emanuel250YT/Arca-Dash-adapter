import type { CountResponse, SalesResponse, DashboardStats } from "@/types/Api";

/**
 * Fetches various statistics for the dashboard, including user count, course count,
 * sales data, blog post count, and total earnings per currency. It fetches data concurrently
 * from multiple API endpoints and consolidates them into a single object for easy use in the dashboard.
 *
 * @returns {Promise<DashboardStats>} A promise that resolves to an object containing the
 * various statistics:
 *   - `users`: The total number of users.
 *   - `courses`: The total number of courses.
 *   - `sales`: The total number of sales for the current month.
 *   - `blogs`: The total number of blog posts.
 *   - `earnings`: An object mapping currency codes (e.g. "ars", "usd") to the total earnings.
 *
 * @throws {Error} If any of the API requests fail or the data cannot be fetched properly,
 * returns default values of `0` for all fields, and an empty object for earnings.
 *
 * @example
 * const stats = await fetchDashboardStats();
 * console.log(stats);
 * // {
 * //   users: 1000,
 * //   courses: 25,
 * //   sales: 150,
 * //   blogs: 10,
 * //   earnings: { ars: 1520, usd: 230 }
 * // }
 */
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [usersRes, coursesRes, salesRes, blogsRes] = await Promise.all([
      fetch("/api/v1/users/count"),
      fetch("/api/v1/courses/count"),
      fetch("/api/v1/orders/month"),
      fetch("/api/v1/blogs/count"),
    ]);

    if (!usersRes.ok || !coursesRes.ok || !salesRes.ok || !blogsRes.ok) {
      return {
        users: 0,
        courses: 0,
        sales: 0,
        blogs: 0,
        earnings: {},
      };
    }
    
    const [usersData, coursesData, salesData, blogsData]: [
      CountResponse,
      CountResponse,
      SalesResponse,
      CountResponse
    ] = await Promise.all([
      usersRes.json(),
      coursesRes.json(),
      salesRes.json(),
      blogsRes.json(),
    ]);

    const sales = (
      Array.isArray(salesData.body) ? salesData.body : []
    ) as Array<{
      currency?: string;
      partialTotal?: unknown;
    }>;

    const earnings: Record<string, number> = sales.reduce((acc, sale) => {
      const currency = sale.currency?.toLowerCase();
      const total =
        typeof sale.partialTotal === "number" ? sale.partialTotal : 0;

      if (!currency) return acc;

      acc[currency] = (acc[currency] || 0) + total;
      return acc;
    }, {} as Record<string, number>);

    return {
      users: usersData.body.count,
      courses: coursesData.body.count,
      sales: sales.length,
      blogs: blogsData.body.count,
      earnings,
    };
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    return {
      users: 0,
      courses: 0,
      sales: 0,
      blogs: 0,
      earnings: {},
    };
  }
};
