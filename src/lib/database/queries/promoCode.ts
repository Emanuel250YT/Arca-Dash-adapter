/* eslint-disable @typescript-eslint/no-unused-vars */
import { IReview, SQLReview } from "@/classes/Review";
import { query } from "../mysql";
import { IPagination } from "@/classes/Filters";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL, BASE_QUERY_GET_ALL_WITH_FILTER, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";
import { IPromoCode, SQLPromoCode } from "@/classes/PromoCode";

export async function CREATE_PROMO_CODE_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.promo_code (
  uuid varchar(255) not null,
  course varchar(255),
  promo_code varchar(255),
  discount FLOAT not null,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  primary key (uuid)
)`);
}

export async function CREATE_PROMO_CODE(promoCode: IPromoCode) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.review (author, content, stars, uuid, course, created_at, updated_at) VALUES
  //   (?, ?, ?, ?, ?, ?, ?)`, [review.author, review.content, review.stars, review.uuid, review.course, review.created_at, review.updated_at]);

  const baseQuery = BASE_CREATE_QUERY(promoCode, "promo_code")

  await query(baseQuery.query, baseQuery.values);

  const result = await GET_PROMO_CODE_BY_UUID(promoCode.uuid)

  return result as SQLPromoCode
}

export async function GET_PROMO_CODE_BY_UUID(uuid: string) {
  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "promo_code")
  const rawResult = await query(baseQuery.query, baseQuery.values);

  const result = rawResult as null | SQLPromoCode[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}

export async function GET_PROMO_CODE_BY_NAME(promoCode: string) {
  const baseQuery = BASE_QUERY_GET_BY_PARAM("promo_code", promoCode.toUpperCase(), "promo_code")
  const rawResult = await query(baseQuery.query, baseQuery.values);

  const result = rawResult as null | SQLPromoCode[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}







export async function GET_ALL_PROMO_CODES(pagination?: IPagination) {
  // const rawResult = pagination ? await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.review LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`) : await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.review`)
  const baseQuery = BASE_QUERY_GET_ALL("promo_code", pagination)
  const rawResult = await query(baseQuery.query, baseQuery.values);
  const result = rawResult as SQLPromoCode[]
  return result
}

export async function GET_ALL_PROMO_CODES_COUNT() {

  const baseQuery = BASE_QUERY_GET_ALL("promo_code")

  const rawResult = await query(baseQuery.query);

  const result = rawResult as null | { count: number }[]

  if (!rawResult || !result || result.length < 1) return 0

  return result[0].count
}

export async function DELETE_PROMO_CODE_BY_UUID(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "promo_code")

  // await query(`DELETE FROM ${process.env.MYSQL_DATABASE}.review WHERE uuid = ?`, [uuid]);
  await query(baseQuery.query, baseQuery.values);


  return await GET_PROMO_CODE_BY_UUID(uuid) ? true : false
}


export async function UPDATE_PROMO_CODE(uuid: string, promo_code: IPromoCode) {
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

  const baseQuery = BASE_UPDATE_QUERY(promo_code, "promo_code", uuid);
  await query(baseQuery.query, baseQuery.values);

  const result = await GET_PROMO_CODE_BY_UUID(uuid);
  return result as SQLPromoCode;
}
