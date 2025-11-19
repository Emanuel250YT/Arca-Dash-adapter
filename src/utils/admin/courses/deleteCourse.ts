import { toast } from "react-toastify";

/**
 * Deletes a course and all associated resources.
 *
 * @param courseId - The UUID of the course to delete.
 */
export async function deleteCourse(courseId: string): Promise<void> {
  try {
    const courseRes = await fetch(`/api/v1/course/${courseId}`);
    if (!courseRes.ok) throw new Error("Failed to fetch course data.");
    const courseData: { banner?: string } = await courseRes.json();

    const deleteCourseRes = await fetch(`/api/v1/course/${courseId}`, {
      method: "DELETE",
    });
    if (!deleteCourseRes.ok) throw new Error("Failed to delete course.");

    if (courseData.banner) {
      const bannerFilename = courseData.banner.split("/").pop();
      if (bannerFilename) {
        const deleteBannerRes = await fetch(
          `/api/v1/content/general/${bannerFilename}`,
          {
            method: "DELETE",
          }
        );
        if (!deleteBannerRes.ok) {
          console.warn("Failed to delete banner image.");
        }
      }
    }

    const courseContentRes = await fetch(
      `/api/v1/course-content/${courseId}`
    );
    if (!courseContentRes.ok)
      throw new Error("Failed to fetch course content.");
    const courseContentData: {
      body?: { uuid: string; content?: string }[];
    } = await courseContentRes.json();

    if (courseContentData.body?.length) {
      for (const element of courseContentData.body) {
        const deleteContentRes = await fetch(
          `/api/v1/course-content/${element.uuid}`,
          {
            method: "DELETE",
          }
        );
        if (!deleteContentRes.ok) {
          console.warn(`Failed to delete content section: ${element.uuid}`);
        }

        if (element.content) {
          const deleteMediaRes = await fetch(
            `/api/v1/content/dash/${element.content}`,
            {
              method: "DELETE",
            }
          );
          if (!deleteMediaRes.ok) {
            console.warn(`Failed to delete media file: ${element.content}`);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error deleting the course and its resources:", error);
    toast.error("Ocurrió un error al eliminar el curso. Intenta nuevamente.");
  }
}
