import { IComponent, SQLComponent } from "@/classes/Component";
import { query } from "../mysql";
import { IPagination } from "@/classes/Filters";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL, BASE_QUERY_GET_ALL_COUNT, BASE_QUERY_GET_ALL_WITH_FILTER, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";

export async function CREATE_COMPONENT_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.component (
  uuid varchar(255) not null,
  itemKey varchar(255) null,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  views TEXT not null,
  primary key (uuid)
)`);
}

export async function GET_COMPONENTS_FROM_VIEW(view: string) {
  const customFilter = {
    sql: " WHERE views LIKE ? OR views LIKE ?",
    params: ["%" + view + "%", "%GLOBAL%"]
  }
  const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("component", customFilter.sql, undefined)
  const rawResult = await query(baseQuery.query, customFilter.params);

  const result = rawResult as null | SQLComponent[]

  if (!rawResult || !result) return [] as SQLComponent[]

  return result
}

export async function CREATE_COMPONENT(component: IComponent) {

  const baseQuery = BASE_CREATE_QUERY(component, "component")


  await query(baseQuery.query, baseQuery.values)

  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.component (uuid, itemKey, views) VALUES (?, ?, ?)`, [component.uuid, component.itemKey, component.views.join(", ")]);

  const result = await GET_COMPONENT_BY_UUID(component.uuid)

  return result

}

export async function DELETE_COMPONENT_BY_UUID(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "component")
  await query(baseQuery.query, baseQuery.values)
  // await query(`DELETE FROM ${process.env.MYSQL_DATABASE}.component WHERE uuid = ?`, [uuid]);

  return await GET_COMPONENT_BY_UUID(uuid) ? true : false
}


export async function GET_COMPONENT_BY_UUID(uuid: string) {

  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "component")
  const rawResult = await query(baseQuery.query, baseQuery.values)
  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.component WHERE uuid = ?`, [uuid]);

  const result = rawResult as null | SQLComponent[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}

export async function GET_ALL_COMPONENTS(pagination?: IPagination) {
  // const rawResult = pagination ? await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.component LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`) : await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.component`);

  const baseQuery = BASE_QUERY_GET_ALL("component", pagination)
  const rawResult = await query(baseQuery.query)


  const result = rawResult as null | SQLComponent[]

  if (!rawResult || !result) return [] as SQLComponent[]

  return result
}

export async function GET_ALL_COMPONENTS_COUNT() {

  // const rawResult = await query(`SELECT COUNT(*) as count FROM ${process.env.MYSQL_DATABASE}.component`);

  const baseQuery = BASE_QUERY_GET_ALL_COUNT("component")
  const rawResult = await query(baseQuery.query)

  const result = rawResult as null | { count: number }[]

  if (!rawResult || !result) return 0

  return result[0].count
}

export async function UPDATE_COMPONENT(uuid: string, component: IComponent) {
  const baseQuery = BASE_UPDATE_QUERY(component, "component", uuid)
  await query(baseQuery.query, baseQuery.values)
  // await query(`UPDATE ${process.env.MYSQL_DATABASE}.component SET itemKey = ?, views = ? WHERE uuid = ?`, [component.itemKey, component.views.join(", "), uuid]);

  const result = await GET_COMPONENT_BY_UUID(uuid)

  return result
}