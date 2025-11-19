import { RowDataPacket } from "mysql2";
import zod from "zod"

export interface IPromoCode {
  uuid: string;
  course: string | null;
  promo_code: string;
  discount: number;
  created_at?: string;
  updated_at?: string;
}

export interface SQLPromoCode extends IPromoCode, RowDataPacket { }

export const ZPromoCodeCreate = zod.object({
  course: zod.string().optional(),
  promo_code: zod.string(),
  discount: zod.number()
});

export const ZApplyPromoCode = zod.object({
  courses: zod.array(zod.object({
    uuid: zod.string()
  })),
})
