import { RowDataPacket } from "mysql2";
import zod from "zod"

export interface IUser {
  uuid: string,
  email: string,
  password: string,
  role: string,
  first_name?: string,
  last_name?: string,
  created_at?: number,
  updated_at?: number,
}

export interface SQLUser extends RowDataPacket, IUser { }

export const ZUserCreate = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8).max(100),
  captcha: zod.string(),
  first_name: zod.string(),
  last_name: zod.string(),
  role: zod.string().optional()
})

export const ZUserPasswordUpdate = zod.object({
  password: zod.string().min(8).max(100),
  token: zod.string().min(1),
})
