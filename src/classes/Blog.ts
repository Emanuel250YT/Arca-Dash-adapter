import { RowDataPacket } from "mysql2";
import zod from "zod"

export interface IBlog {
  uuid: string;
  lang: string;
  title: string;
  created_at?: string;
  updated_at?: string;
  content_subtype: string;
  views: number;
  text_content: string;
  short_text_content: string;
  attachments: string | Array<string>;
  content_type: string;
  category: string;
  banner: string;
  hyper_type: string;
}

export interface SQLBlog extends IBlog, RowDataPacket { }

export const ZBlogCreate = zod.object({
  lang: zod.string(),
  title: zod.string(),
  content_subtype: zod.string(),
  views: zod.number(),
  text_content: zod.string(),
  short_text_content: zod.string(),
  content_type: zod.string(),
  category: zod.string(),
  hyper_type: zod.string(),
  banner: zod.string(),
  attachments: zod.array(zod.string())
});