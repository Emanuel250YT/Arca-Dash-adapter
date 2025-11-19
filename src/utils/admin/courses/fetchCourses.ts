import { CoursesQueryParams } from "@/types/Api";
import { buildQueryParams } from "./buildQueryParams";
import { ICourse } from "@/classes/Course";
import { Dispatch, SetStateAction } from "react";

interface CoursesList {
  courses: ICourse[];
  totalPages: number;
}

export const fetchCourses = async (
  currentPage: number,
  coursesPerPage: number,
  filters: CoursesQueryParams,
  setLoading: Dispatch<SetStateAction<boolean>>,
  signal?: AbortSignal
): Promise<CoursesList> => {
  setLoading(true);
  try {
    const query = buildQueryParams(currentPage, coursesPerPage, filters);
    const res = await fetch(`/api/v1/courses?${query}`, {
      signal,
    });
    const data = await res.json();

    setLoading(false);

    return {
      courses: data.body.content,
      totalPages: data.body.totalPages,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.name !== "AbortError") {
      console.error("Error fetching courses:", err);
      setLoading(false);
    }
    return {
      courses: [],
      totalPages: 0,
    };
  }
};
