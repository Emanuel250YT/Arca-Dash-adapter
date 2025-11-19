// import { IReview, SQLReview } from "@/classes/Review";
import { query } from "../mysql";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL, BASE_QUERY_GET_ALL_COUNT, BASE_QUERY_GET_ALL_WITH_FILTER, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";
import { IPagination } from "@/classes/Filters";
import { ICourseContent, SQLCourseContent } from "@/classes/CourseContent";

export async function CREATE_COURSE_CONTENT_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.course_content (
  uuid varchar(255) not null,
  course varchar(255) not null,
  part INT not null,
  content varchar(255) not null,
  title varchar(255) not null,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  duration INT not null,
  type varchar(255) not null,
  associated varchar(255),
  primary key (uuid)
)`);
}



export async function CREATE_COURSE_CONTENT(courseContent: ICourseContent) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.BLOG (uuid, user, courses, created_at, currency, provider, promo_code) VALUES
  //   (? , ? , ? , ? , ? , ? , ?)`, [BLOG.uuid, BLOG.user, (BLOG.courses as Array<string>).join(" , "), BLOG.created_at, BLOG.currency, BLOG.provider, BLOG.promo_code]);

  const baseQuery = BASE_CREATE_QUERY(courseContent, "course_content")
  await query(baseQuery.query, baseQuery.values)

  const result = await GET_COURSE_CONTENT_BY_UUID(courseContent.uuid)

  return result as SQLCourseContent
}

export async function GET_COURSE_CONTENT_BY_UUID(uuid: string) {


  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.BLOG WHERE uuid = ?`, [uuid]);
  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "course_content")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLCourseContent[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0] as SQLCourseContent
}


export async function UPDATE_COURSE_CONTENT(uuid: string, courseContent: ICourseContent) {

  const baseQuery = BASE_UPDATE_QUERY(courseContent, "course_content", uuid)
  await query(baseQuery.query, baseQuery.values);
  return await GET_COURSE_CONTENT_BY_UUID(uuid)
}

export async function DELETE_COURSE_CONTENT(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "course_content")
  await query(baseQuery.query, baseQuery.values);
  return await GET_COURSE_CONTENT_BY_UUID(uuid) ? true : false
}


export async function GET_ALL_COURSE_CONTENTS(pagination?: IPagination/*, filter?: ICourseContentFilter*/) {
  //const customFilter = blogQueryParamsToSQL(filter)


  //const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("course", customFilter?.sql ?? "", pagination)


  //const rawResult = await query(baseQuery.query, customFilter?.params ?? [])

  const baseQuery = BASE_QUERY_GET_ALL("course_content", pagination)
  const rawResult = await query(baseQuery.query)

  const result = rawResult as null | SQLCourseContent[]

  if (!rawResult || !result || result.length < 1) return [] as SQLCourseContent[]

  return result
}


export async function GET_ALL_COURSE_CONTENTS_FROM_COURSE(uuid: string, pagination?: IPagination) {
  //const customFilter = blogQueryParamsToSQL(filter)


  //const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("course", customFilter?.sql ?? "", pagination)


  //const rawResult = await query(baseQuery.query, customFilter?.params ?? [])

  const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("course_content", "WHERE course = ?", pagination)
  const rawResult = await query(baseQuery.query, [uuid])

  const result = rawResult as null | SQLCourseContent[]

  if (!rawResult || !result || result.length < 1) return [] as SQLCourseContent[]

  return result
}


export async function GET_ALL_COURSE_CONTENTS_COUNT() {

  const baseQuery = BASE_QUERY_GET_ALL_COUNT("course_content")

  const rawResult = await query(baseQuery.query)
  const result = rawResult as { count: number }[]

  return result[0].count
}

export async function GET_COURSE_CONTENT_BY_VIDEO_UUID(videoUUID: string) {
  const baseQuery = BASE_QUERY_GET_BY_PARAM("content", videoUUID, "course_content")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLCourseContent[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}

export async function UPDATE_COURSE_CONTENT_PARTS(course: string, part: number, type: string) {
  const filter = `WHERE course = ? AND part >= ? AND type = ?`;
  const params = [course, part, type];

  const updateQuery = `UPDATE ${process.env.MYSQL_DATABASE}.course_content SET part = part + 1 ${filter}`;
  await query(updateQuery, params);

  return await GET_ALL_COURSE_CONTENTS_FROM_COURSE(course);
}

export async function UPDATE_COURSE_CONTENT_PARTS_ON_DELETE(course: string, part: number, type: string) {
  const filter = `WHERE course = ? AND part > ? AND type = ?`;
  const params = [course, part, type];

  const updateQuery = `UPDATE ${process.env.MYSQL_DATABASE}.course_content SET part = part - 1 ${filter}`;
  await query(updateQuery, params);

  return await GET_ALL_COURSE_CONTENTS_FROM_COURSE(course);
}
