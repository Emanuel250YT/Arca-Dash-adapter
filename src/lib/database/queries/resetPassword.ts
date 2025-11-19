import { IPagination } from "@/classes/Filters";
import { BASE_CREATE_QUERY, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL_COUNT, BASE_QUERY_GET_ALL } from "../baseQueryBuilder";
import { query } from "../mysql";
import { IResetPassword, SQLResetPassword } from "@/classes/ResetPassword";

export async function CREATE_RESET_PASSWORD_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.reset_password (
  uuid varchar(255) not null,
  token varchar(255) not null,
  userId varchar(255) not null,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  primary key (uuid)
)`);
}

export async function CREATE_RESET_PASSWORD(resetPassword: IResetPassword) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.BLOG (uuid, user, courses, created_at, currency, provider, promo_code) VALUES
  //   (? , ? , ? , ? , ? , ? , ?)`, [BLOG.uuid, BLOG.user, (BLOG.courses as Array<string>).join(" , "), BLOG.created_at, BLOG.currency, BLOG.provider, BLOG.promo_code]);

  const baseQuery = BASE_CREATE_QUERY(resetPassword, "reset_password")
  await query(baseQuery.query, baseQuery.values)

  const result = await GET_RESET_PASSWORD_BY_UUID(resetPassword.uuid)

  return result as SQLResetPassword
}

export async function GET_RESET_PASSWORD_BY_UUID(uuid: string) {


  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.BLOG WHERE uuid = ?`, [uuid]);
  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "reset_password")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLResetPassword[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}

export async function GET_RESET_PASSWORD_BY_TOKEN(uuid: string) {


  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.BLOG WHERE uuid = ?`, [uuid]);
  const baseQuery = BASE_QUERY_GET_BY_PARAM("token", uuid, "reset_password")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLResetPassword[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}

export async function GET_RESET_PASSWORD_BY_USER(uuid: string) {


  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.BLOG WHERE uuid = ?`, [uuid]);
  const baseQuery = BASE_QUERY_GET_BY_PARAM("userId", uuid, "reset_password")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLResetPassword[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}



export async function UPDATE_RESET_PASSWORD(uuid: string, reset_password: IResetPassword) {

  const baseQuery = BASE_UPDATE_QUERY(reset_password, "reset_password", uuid)
  await query(baseQuery.query, baseQuery.values);
  return await GET_RESET_PASSWORD_BY_UUID(uuid)
}

export async function DELETE_RESET_PASSWORD(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "reset_password")
  await query(baseQuery.query, baseQuery.values);
  return await GET_RESET_PASSWORD_BY_UUID(uuid) ? true : false
}

export async function DELETE_RESET_PASSWORD_BY_USER(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("userId", uuid, "reset_password")
  await query(baseQuery.query, baseQuery.values);
  return await GET_RESET_PASSWORD_BY_USER(uuid) ? true : false
}

export async function GET_ALL_RESET_PASSWORD(pagination?: IPagination) {


  const baseQuery = BASE_QUERY_GET_ALL("reset_password", pagination)


  const rawResult = await query(baseQuery.query, [])

  const result = rawResult as null | SQLResetPassword[]

  if (!rawResult || !result || result.length < 1) return [] as SQLResetPassword[]

  return result
}


export async function GET_ALL_RESET_PASSWORD_COUNT() {

  const baseQuery = BASE_QUERY_GET_ALL_COUNT("reset_password")

  const rawResult = await query(baseQuery.query)
  const result = rawResult as { count: number }[]

  return result[0].count
}
