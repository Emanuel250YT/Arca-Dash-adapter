import { RowDataPacket } from "mysql2";
import zod from "zod"

export interface IReview {
  uuid: string;
  author: string;
  content: string;
  stars: number;
  course: string;
  created_at?: number;
  updated_at?: number;
}

export interface SQLReview extends IReview, RowDataPacket { }

export const ZReviewCreate = zod.object({
  content: zod.string(),
  stars: zod.number(),
  course: zod.string()
})