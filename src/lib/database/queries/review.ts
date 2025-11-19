import { IReview, SQLReview } from "@/classes/Review";
import { query } from "../mysql";
import { IPagination } from "@/classes/Filters";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL, BASE_QUERY_GET_ALL_WITH_FILTER, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";

export async function CREATE_REVIEW_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.review (
  uuid varchar(255) not null,
  author varchar(255) not null,
  course varchar(255) not null,
  content TEXT null,
  stars INT null,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  primary key (uuid)
)`);
}

export async function CREATE_REVIEW(review: IReview) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.review (author, content, stars, uuid, course, created_at, updated_at) VALUES
  //   (?, ?, ?, ?, ?, ?, ?)`, [review.author, review.content, review.stars, review.uuid, review.course, review.created_at, review.updated_at]);

  const baseQuery = BASE_CREATE_QUERY(review, "review")

  await query(baseQuery.query, baseQuery.values);

  const result = await GET_REVIEW_BY_UUID(review.uuid)

  return result as SQLReview
}

export async function GET_REVIEW_BY_UUID(uuid: string) {
  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "review")
  const rawResult = await query(baseQuery.query, baseQuery.values);

  const result = rawResult as null | SQLReview[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}

export async function GET_REVIEW_WITH_USER_AND_COURSE(course: string, user: string) {
  const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("review", "WHERE author = ? AND course = ?")
  const rawResult = await query(baseQuery.query, [user, course]);

  const result = rawResult as null | SQLReview[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}

export async function GET_REVIEWS_FROM_COURSE(course: string) {

  const baseQuery = BASE_QUERY_GET_BY_PARAM("course", course, "review")
  const rawResult = await query(baseQuery.query, baseQuery.values);

  const result = rawResult as null | SQLReview[]

  if (!rawResult || !result) return [] as SQLReview[]

  return result
}

export async function GET_ALL_REVIEWS(pagination?: IPagination) {
  // const rawResult = pagination ? await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.review LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`) : await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.review`)
  const baseQuery = BASE_QUERY_GET_ALL("review", pagination)
  const rawResult = await query(baseQuery.query, baseQuery.values);
  const result = rawResult as SQLReview[]
  return result
}

export async function GET_ALL_REVIEWS_COUNT() {

  const baseQuery = BASE_QUERY_GET_ALL("review")

  const rawResult = await query(baseQuery.query);

  const result = rawResult as null | { count: number }[]

  if (!rawResult || !result || result.length < 1) return 0

  return result[0].count
}

export async function DELETE_REVIEW_BY_UUID(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "review")

  // await query(`DELETE FROM ${process.env.MYSQL_DATABASE}.review WHERE uuid = ?`, [uuid]);
  await query(baseQuery.query, baseQuery.values);


  return await GET_REVIEW_BY_UUID(uuid) ? true : false
}


export async function UPDATE_REVIEW(uuid: string, review: IReview) {
  // await query(
  //   `UPDATE ${process.env.MYSQL_DATABASE}.review
  //    SET uuid = ?,
  //        author = ?,
  //        course = ?,
  //        content = ?,
  //        stars = ?,
  //        created_at = ?,
  //        updated_at = NOW(),
  //    WHERE uuid = ?`,
  //   [
  //     uuid,
  //     review.author,
  //     review.course,
  //     review.content,
  //     review.stars,
  //     review.created_at,
  //     uuid
  //   ]
  // );

  const baseQuery = BASE_UPDATE_QUERY(review, "review", uuid);
  await query(baseQuery.query, baseQuery.values);

  const result = await GET_REVIEW_BY_UUID(uuid);
  return result as SQLReview;
}
