import { RowDataPacket } from "mysql2";
import zod from "zod"
import { ILang } from "./Lang";

export interface IComponent {
  uuid: string,
  views: Array<string>,
  itemKey: string,
  lang?: Array<ILang>,
  created_at?: string;
  updated_at?: string;
}

export interface SQLComponent extends IComponent, RowDataPacket { }

export const ZComponentCreate = zod.object({
  views: zod.array(zod.string()),
  itemKey: zod.string(),
})