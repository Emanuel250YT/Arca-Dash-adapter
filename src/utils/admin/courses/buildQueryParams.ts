import { CoursesQueryParams } from "@/types/Api";

export const buildQueryParams = (currentPage: number, coursesPerPage: number, filters: CoursesQueryParams) => {
  const params = new URLSearchParams();

  if (coursesPerPage) params.append("page", currentPage.toString());
  if (coursesPerPage) params.append("limit", coursesPerPage.toString());

  if (filters.contain) params.append("contain", filters.contain);

  return params.toString();
};
