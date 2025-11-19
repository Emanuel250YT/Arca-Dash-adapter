import { RowDataPacket } from "mysql2";
import zod from "zod"

export interface IView {
  uuid: string,
  name: string
}

export interface SQLView extends IView, RowDataPacket { }

export const ZViewCreate = zod.object({
  name: zod.string()
})