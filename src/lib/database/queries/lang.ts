/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILang, SQLLang } from "@/classes/Lang";
import { query } from "../mysql";
import { IPagination } from "@/classes/Filters";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL, BASE_QUERY_GET_ALL_COUNT, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";

export async function CREATE_LANG_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.lang (
  uuid varchar(255) not null,
  lang varchar(255) not null,
  content varchar(255) not null,
  component varchar(255) not null,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  primary key (uuid)
)`);
}

export async function GET_LANGS_BY_COMPONENT(uuid: string) {


  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.lang WHERE component = ?`, [uuid]);

  const baseQuery = BASE_QUERY_GET_BY_PARAM("component", uuid, "lang")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLLang[]

  if (!rawResult || !result || result.length < 1) return [] as SQLLang[]

  return result
}


export async function GET_LANG_BY_UUID(uuid: string) {
  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.lang WHERE uuid = ?`, [uuid]);

  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "lang")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLLang[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}



export async function CREATE_LANG(lang: ILang) {

  const baseQuery = BASE_CREATE_QUERY(lang, "lang")
  await query(baseQuery.query, baseQuery.values)
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.lang (uuid, lang, content, component) VALUES (?, ?, ?, ?)`, [lang.uuid, lang.lang, lang.content, lang.component]);

  const result = await GET_LANG_BY_UUID(lang.uuid)

  return result

}

export async function GET_ALL_LANGS(pagination?: IPagination) {

  const baseQuery = BASE_QUERY_GET_ALL("lang", pagination)
  const rawResult = await query(baseQuery.query)

  // const rawResult = pagination ? await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.lang LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`) : await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.lang`);

  const result = rawResult as null | SQLLang[]

  if (!rawResult || !result) return [] as SQLLang[]

  return result
}

export async function GET_ALL_LANGS_COUNT(): Promise<number> {

  const baseQuery = BASE_QUERY_GET_ALL_COUNT("lang")
  const rawResult = await query(baseQuery.query)

  // const rawResult = await query(`SELECT COUNT(*) as count FROM ${process.env.MYSQL_DATABASE}.lang`)
  const result = rawResult as { [key: string]: any }[]

  return result[0].count
}

export async function DELETE_LANG_BY_UUID(uuid: string) {

  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "lang")

  // await query(`DELETE FROM ${process.env.MYSQL_DATABASE}.lang WHERE uuid = ?`, [uuid]);
  await query(baseQuery.query, baseQuery.values);


  return await GET_LANG_BY_UUID(uuid) ? true : false
}

export async function UPDATE_LANG(uuid: string, lang: ILang) {

  const baseQuery = BASE_UPDATE_QUERY(lang, "lang", uuid)
  await query(baseQuery.query, baseQuery.values);

  // await query(`UPDATE ${process.env.MYSQL_DATABASE}.lang SET component = ?, content = ?, lang = ? WHERE uuid = ?`, [lang.component, lang.content, lang.lang, uuid]);

  const result = await GET_LANG_BY_UUID(uuid)

  return result
}