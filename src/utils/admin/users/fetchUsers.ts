import { UsersQueryParams } from "@/types/Api";
import { buildQueryParams } from "./buildQueryParams";
import { IUser } from "@/classes/User";
import { Dispatch, SetStateAction } from "react";

interface UsersList {
  users: IUser[];
  totalPages: number;
}

export const fetchUsers = async (
  currentPage: number,
  coursesPerPage: number,
  filters: UsersQueryParams,
  setLoading: Dispatch<SetStateAction<boolean>>,
  signal?: AbortSignal
): Promise<UsersList> => {
  setLoading(true);
  try {
    const query = buildQueryParams(currentPage, coursesPerPage, filters);
    const res = await fetch(`/api/v1/users?${query}`, {
      signal,
    });
    const data = await res.json();

    setLoading(false);

    return {
      users: data.body.content,
      totalPages: data.body.totalPages,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.name !== "AbortError") {
      console.error("Error fetching courses:", err);
      setLoading(false);
    }

    return {
      users: [],
      totalPages: 0,
    };
  }
};
