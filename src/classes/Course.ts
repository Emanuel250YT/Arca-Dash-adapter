import { RowDataPacket } from "mysql2";
import zod from "zod"
import { ICourseContent } from "./CourseContent";
import { IReview } from "./Review";

export interface ICourse {
  uuid: string;
  title: string;
  description: string;
  short_description: string;
  difficulty: string;
  attributes: string | Array<string>;
  details: string | Array<string>;
  usd_price: number;
  ar_price: number;
  created_at?: number;
  updated_at?: number;
  enabled: boolean;
  parts?: Array<ICourseContent>
  banner: string;
  sells: number,
  reviews: Array<IReview> | number,
  stars: number,
  category: string
}

export interface SQLCourse extends ICourse, RowDataPacket { }

export const ZCourseCreate = zod.object({
  title: zod.string(),
  description: zod.string(),
  short_description: zod.string(),
  difficulty: zod.string(),
  attributes: zod.array(zod.string()),
  details: zod.array(zod.string()),
  usd_price: zod.number(),
  ar_price: zod.number(),
  banner: zod.string(),
  category: zod.string()
})