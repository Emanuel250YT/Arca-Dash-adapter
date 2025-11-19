// import { IReview, SQLReview } from "@/classes/Review";
import { query } from "../mysql";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL_COUNT, BASE_QUERY_GET_ALL_WITH_FILTER, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";
import { IBlogFilter, IPagination } from "@/classes/Filters";
import { IBlog, SQLBlog } from "@/classes/Blog";
import { blogQueryParamsToSQL } from "@/utils/urlParser";

export async function CREATE_BLOG_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.blog (
  uuid varchar(255) not null,
  lang varchar(255) not null,
  title varchar(255) not null,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  content_subtype varchar(255) null,
  views INT not null default 0,
  text_content TEXT null,
  short_text_content TEXT null,
  attachments TEXT null,
  content_type varchar(255) null,
  category varchar(255) null,
  banner varchar(255) null,
  hyper_type varchar(255) null,
  primary key (uuid)
)`);
}



export async function CREATE_BLOG(blog: IBlog) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.BLOG (uuid, user, courses, created_at, currency, provider, promo_code) VALUES
  //   (? , ? , ? , ? , ? , ? , ?)`, [BLOG.uuid, BLOG.user, (BLOG.courses as Array<string>).join(" , "), BLOG.created_at, BLOG.currency, BLOG.provider, BLOG.promo_code]);

  const baseQuery = BASE_CREATE_QUERY(blog, "blog")
  await query(baseQuery.query, baseQuery.values)

  const result = await GET_BLOG_BY_UUID(blog.uuid)

  return result as SQLBlog
}

export async function GET_BLOG_BY_UUID(uuid: string) {


  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.BLOG WHERE uuid = ?`, [uuid]);
  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "blog")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLBlog[]

  if (!rawResult || !result || result.length < 1) return [] as SQLBlog[]

  return result[0]
}


export async function UPDATE_BLOG(uuid: string, blog: IBlog) {

  const baseQuery = BASE_UPDATE_QUERY(blog, "blog", uuid)
  await query(baseQuery.query, baseQuery.values);
  return await GET_BLOG_BY_UUID(uuid)
}

export async function DELETE_BLOG(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "blog")
  await query(baseQuery.query, baseQuery.values);
  return await GET_BLOG_BY_UUID(uuid) ? true : false
}


export async function GET_ALL_BLOGS(pagination?: IPagination, filter?: IBlogFilter) {
  const customFilter = blogQueryParamsToSQL(filter)

  console.log(customFilter)

  const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("blog", customFilter?.sql ?? "", pagination)


  const rawResult = await query(baseQuery.query, customFilter?.params ?? [])

  const result = rawResult as null | SQLBlog[]

  if (!rawResult || !result || result.length < 1) return [] as SQLBlog[]

  return result
}


export async function GET_ALL_BLOGS_COUNT() {

  const baseQuery = BASE_QUERY_GET_ALL_COUNT("blog")

  const rawResult = await query(baseQuery.query)
  const result = rawResult as { count: number }[]

  return result[0].count
}
