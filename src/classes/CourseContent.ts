import { RowDataPacket } from "mysql2";
import zod from "zod"

export interface ICourseContent {
  uuid: string;
  course: string;
  part: number;
  content: string;
  title: string;
  description: string;
  short_description: string;
  created_at?: string;
  updated_at?: string;
  duration: string;
  type: string;
  associated?: string;
}

export interface SQLCourseContent extends ICourseContent, RowDataPacket { }

export const ZCourseContentCreate = zod.object({
  course: zod.string(),
  part: zod.number(),
  content: zod.string(),
  title: zod.string(),
  description: zod.string(),
  short_description: zod.string(),
  duration: zod.union([zod.string(), zod.number()]).optional(),
  type: zod.string(),
  associated: zod.union([zod.string(), zod.null()]).optional()
})