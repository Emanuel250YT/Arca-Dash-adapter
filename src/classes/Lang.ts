import { RowDataPacket } from "mysql2";
import zod from "zod"

export interface ILang {
  uuid: string;
  lang: string;
  content: string;
  component: string;
  created_at?: string;
  updated_at?: string;
}

export interface SQLLang extends ILang, RowDataPacket { }

export const ZLangCreate = zod.object({
  lang: zod.string(),
  content: zod.string(),
  component: zod.string(),
});