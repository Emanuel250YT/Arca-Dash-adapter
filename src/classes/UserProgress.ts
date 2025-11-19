import { RowDataPacket } from "mysql2";
import zod from "zod"

export interface IUserProgress {
  uuid: string;
  course: string;
  user: string;
  lesson: string;
  completed: boolean
  percent: number;
  created_at?: string | number;
  updated_at?: string | number;
}

export interface SQLUserProgress extends IUserProgress, RowDataPacket { }

export const ZUserProgressCreate = zod.object({
  course: zod.string(),
  user: zod.string(),
  completed: zod.boolean(),
  percent: zod.number(),
  lesson: zod.string(),
})