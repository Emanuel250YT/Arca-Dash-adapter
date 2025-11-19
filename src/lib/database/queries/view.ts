import { IView, SQLView } from "@/classes/View";
import { query } from "../mysql";
import { IPagination } from "@/classes/Filters"
import { BASE_CREATE_QUERY, BASE_QUERY_GET_ALL, BASE_QUERY_GET_ALL_COUNT, BASE_QUERY_GET_BY_PARAM } from "../baseQueryBuilder";

export async function CREATE_VIEW_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.view (
  uuid varchar(255) not null,
  name varchar(255) null,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  primary key (uuid)
)`);
}

export async function CREATE_VIEW(view: IView) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.view (uuid, name) VALUES
  //   (?, ? )`, [view.uuid, view.name]);

  const baseQuery = BASE_CREATE_QUERY(view, "view")
  await query(baseQuery.query, baseQuery.values)

  const result = await GET_VIEW_BY_UUID(view.uuid)

  return result
}

export async function UPDATE_VIEW(uuid_or_name: string, view: IView) {


  await query(`UPDATE ${process.env.MYSQL_DATABASE}.view SET name = ? WHERE uuid = ? OR name = ?`, [view.name, uuid_or_name, uuid_or_name]);
  return await GET_VIEW_BY_UUID(uuid_or_name)
}

export async function DELETE_VIEW(uuid_or_name: string) {
  await query(`DELETE FROM ${process.env.MYSQL_DATABASE}.view WHERE uuid = ? OR name = ?`, [uuid_or_name, uuid_or_name]);
  return await GET_VIEW_BY_UUID(uuid_or_name) ? true : false
}

export async function GET_VIEW_BY_UUID(uuid: string) {
  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view WHERE uuid = ?`, [uuid]);

  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "view")
  const rawResult = await query(baseQuery.query, baseQuery.values)
  const result = rawResult as null | SQLView[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}

export async function GET_VIEW_BY_NAME(name: string) {
  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view
  //   WHERE name = ?`, [name])

  const baseQuery = BASE_QUERY_GET_BY_PARAM("name", name, "view")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLView[]

  if (!rawResult || !result || result.length < 1) return null
  return result[0]
}

export async function GET_ALL_VIEWS(pagination?: IPagination) {
  const baseQuery = BASE_QUERY_GET_ALL("view", pagination)
  // const rawResult = pagination ? await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`) : await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view`)
  const rawResult = await query(baseQuery.query)

  const result = rawResult as SQLView[]

  return result
}


export async function GET_ALL_VIEWS_COUNT() {

  const baseQuery = BASE_QUERY_GET_ALL_COUNT("view")

  const rawResult = await query(baseQuery.query)
  const result = rawResult as { count: number }[]

  return result[0].count
}