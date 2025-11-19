import { RowDataPacket } from "mysql2";
import zod from "zod"

export interface IFileData {
  uuid: string;
  name: string;
  file: string;
  size?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SQLFileData extends IFileData, RowDataPacket { }

export const ZFileDataCreate = zod.object({
  name: zod.string()
});

