import { RowDataPacket } from "mysql2";
import zod from "zod"

export interface IResetPassword {
  uuid: string;
  token: string;
  userId: string;
  created_at?: string;
  updated_at?: string;
}

export interface SQLResetPassword extends IResetPassword, RowDataPacket { }

export const ZFileDataCreate = zod.object({
  userId: zod.string()
});

