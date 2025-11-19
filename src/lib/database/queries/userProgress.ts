// import { IReview, SQLReview } from "@/classes/Review";
import { query } from "../mysql";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL, BASE_QUERY_GET_ALL_COUNT, BASE_QUERY_GET_ALL_WITH_FILTER, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";
import { IPagination } from "@/classes/Filters";
import { IUserProgress, SQLUserProgress } from "@/classes/UserProgress";

export async function CREATE_USER_PROGRESS_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.user_progress (
  uuid varchar(255) not null,
  course varchar(255) not null,
  user varchar(255) not null,
  completed BOOLEAN not null,
  percent INT not null,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lesson varchar(255) not null,
  primary key (uuid)
)`);
}



export async function CREATE_USER_PROGRESS(userProgress: IUserProgress) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.BLOG (uuid, user, courses, created_at, currency, provider, promo_code) VALUES
  //   (? , ? , ? , ? , ? , ? , ?)`, [BLOG.uuid, BLOG.user, (BLOG.courses as Array<string>).join(" , "), BLOG.created_at, BLOG.currency, BLOG.provider, BLOG.promo_code]);

  const baseQuery = BASE_CREATE_QUERY(userProgress, "user_progress")
  await query(baseQuery.query, baseQuery.values)

  const result = await GET_USER_PROGRESS_BY_UUID(userProgress.uuid)

  return result as SQLUserProgress
}

export async function GET_USER_PROGRESS_BY_UUID(uuid: string) {


  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.BLOG WHERE uuid = ?`, [uuid]);
  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "user_progress")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLUserProgress[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}


export async function UPDATE_USER_PROGRESS(uuid: string, userProgress: IUserProgress) {

  const baseQuery = BASE_UPDATE_QUERY(userProgress, "user_progress", uuid)
  await query(baseQuery.query, baseQuery.values);
  return await GET_USER_PROGRESS_BY_UUID(uuid)
}

export async function DELETE_USER_PROGRESS(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "user_progress")
  await query(baseQuery.query, baseQuery.values);
  return await GET_USER_PROGRESS_BY_UUID(uuid) ? true : false
}


export async function GET_ALL_USER_PROGRESS(pagination?: IPagination/*, filter?: ICourseContentFilter*/) {
  //const customFilter = blogQueryParamsToSQL(filter)


  //const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("course", customFilter?.sql ?? "", pagination)


  //const rawResult = await query(baseQuery.query, customFilter?.params ?? [])

  const baseQuery = BASE_QUERY_GET_ALL("user_progress", pagination)
  const rawResult = await query(baseQuery.query)

  const result = rawResult as null | SQLUserProgress[]

  if (!rawResult || !result || result.length < 1) return [] as SQLUserProgress[]

  return result
}

export async function GET_ALL_USER_PROGRESS_OF_USER(uuid: string, pagination?: IPagination) {


  const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("user_progress", "WHERE user = ?", pagination)


  const rawResult = await query(baseQuery.query, [uuid])

  const result = rawResult as null | SQLUserProgress[]

  if (!rawResult || !result || result.length < 1) return [] as SQLUserProgress[]

  return result
}

export async function GET_ALL_USER_PROGRESS_OF_USER_AND_COURSE(uuid: string, course: string, pagination?: IPagination) {


  const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("user_progress", "WHERE user = ? AND course = ?", pagination)


  const rawResult = await query(baseQuery.query, [uuid, course])

  const result = rawResult as null | SQLUserProgress[]

  if (!rawResult || !result || result.length < 1) return [] as SQLUserProgress[]

  return result
}

export async function GET_USER_PROGRESS_OF_USER_AND_LESSON(uuid: string, lesson: string, pagination?: IPagination) {


  const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("user_progress", "WHERE user = ? AND lesson = ?", pagination)


  const rawResult = await query(baseQuery.query, [uuid, lesson])

  const result = rawResult as null | SQLUserProgress[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}




export async function GET_ALL_USER_PROGRESS_COUNT() {

  const baseQuery = BASE_QUERY_GET_ALL_COUNT("user_progress")

  const rawResult = await query(baseQuery.query)
  const result = rawResult as { count: number }[]

  return result[0].count
}
