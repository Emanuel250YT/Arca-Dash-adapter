/**
 * Fetches view data by its name from the backend.
 *
 * This function attempts to retrieve the content for a specified view name. If the view
 * does not exist, and it is not the special case `"GLOBAL"`, it will attempt to create
 * a fallback view on the backend.
 *
 * This ensures the application does not break due to a missing view and helps maintain
 * dynamic content generation when views are not pre-created.
 *
 * @param {string} viewName - The name of the view to fetch.
 *
 * @returns {Promise<any>} A Promise resolving to the JSON content of the view.
 *
 * @throws {Error} If the request fails and fallback creation is also unsuccessful.
 *
 * @example
 * const data = await fetchViewData("main");
 */

export const fetchViewData = async (viewName: string) => {
  const endpoint = `/api/v1/view/${viewName}`;

  if (viewName === "GLOBAL") {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Failed to fetch global view: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  }

  try {
    const res = await fetch(endpoint);
    if (res.ok) {
      const data = await res.json();
      return data;
    }

    console.warn(
      `View "${viewName}" not found. Attempting to create fallback...`
    );
  } catch (err) {
    console.error(`Error fetching view "${viewName}":`, err);
  }

  try {
    const fallbackRes = await fetch("/api/v1/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: viewName }),
    });

    if (!fallbackRes.ok) {
      throw new Error(`Fallback creation failed: ${fallbackRes.statusText}`);
    }

    const data = await fallbackRes.json();
    return data;
  } catch (fallbackErr) {
    console.error("Error during fallback view creation:", fallbackErr);
    throw new Error("Unable to fetch or create a valid view.");
  }
};
