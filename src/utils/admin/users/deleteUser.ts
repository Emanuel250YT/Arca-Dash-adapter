import { toast } from "react-toastify";

/**
 * Deletes a user and his progress
 *
 * @param userUuid - The UUID of the user to delete.
 */
export async function deleteUser(userUuid: string): Promise<void> {
  try {
    const deleteUserRes = await fetch(`/api/v1/user/${userUuid}`, {
      method: "DELETE",
    });
    if (!deleteUserRes.ok) throw new Error("Failed to delete user progress.");

    const deleteProgressRes = await fetch(`/api/v1/user-progress/${userUuid}`, {
      method: "DELETE",
    });
    if (!deleteProgressRes.ok)
      throw new Error("Failed to delete user progress.");
  } catch (error) {
    console.error("Error deleting the user and its resources:", error);
    toast.error("Ocurrió un error al eliminar el usuario. Intenta nuevamente.");
  }
}
