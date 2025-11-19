import { RowDataPacket } from "mysql2";
import zod from "zod"

export interface IOrder {
  uuid: string;
  user: string;
  courses: string | Array<string>;
  created_at?: number;
  updated_at?: number;
  currency: string;
  provider: string;
  promo_code: string;
  paid: boolean;
  payment_id: string;
  partialContent: string | Array<string>;
  partialTotal: number;
  type: string;
}

export interface IOrderUpdate {
  courses: Array<{ uuid: string }>;
  oneTime: boolean;
  currency: string;
  provider: string; 
  promo_code: string;
  paid: boolean;
}

export interface SQLOrder extends IOrder, RowDataPacket { }

export const ZOrderCreate = zod.object({
  courses: zod.array(zod.object({
    uuid: zod.string()
  })),
  oneTime: zod.boolean(),
  currency: zod.string(),
  provider: zod.string(),
  promo_code: zod.string(),
  user: zod.string().optional(),
  paid: zod.boolean().optional()
})

