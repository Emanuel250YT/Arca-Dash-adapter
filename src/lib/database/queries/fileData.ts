/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { IReview, SQLReview } from "@/classes/Review";
import { query } from "../mysql";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL, BASE_QUERY_GET_ALL_COUNT, BASE_QUERY_GET_ALL_WITH_FILTER, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";
import { IPagination } from "@/classes/Filters";
import { IUserProgress, SQLUserProgress } from "@/classes/UserProgress";
import { INotification, SQLNotification } from "@/classes/Notification";
import { IFileData, SQLFileData } from "@/classes/FileData";

export async function CREATE_FILEDATA_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.file_data (
  uuid varchar(255) not null,
  file varchar(255) null,
  name varchar(255) null,
  size INT NULL,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  primary key (uuid)
)`);
}



export async function CREATE_FILEDATA(fileData: IFileData) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.BLOG (uuid, user, courses, created_at, currency, provider, promo_code) VALUES
  //   (? , ? , ? , ? , ? , ? , ?)`, [BLOG.uuid, BLOG.user, (BLOG.courses as Array<string>).join(" , "), BLOG.created_at, BLOG.currency, BLOG.provider, BLOG.promo_code]);

  const baseQuery = BASE_CREATE_QUERY(fileData, "file_data")
  await query(baseQuery.query, baseQuery.values)

  const result = await GET_FILEDATA_BY_UUID(fileData.uuid)

  return result as SQLFileData
}

export async function GET_FILEDATA_BY_UUID(uuid: string) {


  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.BLOG WHERE uuid = ?`, [uuid]);
  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "file_data")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLFileData[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}


export async function UPDATE_FILEDATA(uuid: string, file_data: IFileData) {

  const baseQuery = BASE_UPDATE_QUERY(file_data, "file_data", uuid)
  await query(baseQuery.query, baseQuery.values);
  return await GET_FILEDATA_BY_UUID(uuid)
}

export async function DELETE_FILEDATA(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "file_data")
  await query(baseQuery.query, baseQuery.values);
  return await GET_FILEDATA_BY_UUID(uuid) ? true : false
}


export async function GET_ALL_FILEDATA(pagination?: IPagination) {


  const baseQuery = `
  SELECT *
  FROM \`${process.env.MYSQL_DATABASE}\`.file_data
  ORDER BY created_at DESC
`;

  const rawResult = pagination
    ? await query(`${baseQuery} LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`)
    : await query(baseQuery);


  const result = rawResult as null | SQLFileData[]

  if (!rawResult || !result || result.length < 1) return [] as SQLFileData[]

  return result
}



export async function GET_FILE_DATA_COUNT(): Promise<number> {

  const baseQuery = BASE_QUERY_GET_ALL_COUNT("file_data")
  const rawResult = await query(baseQuery.query)

  // const rawResult = await query(`SELECT COUNT(*) as count FROM ${process.env.MYSQL_DATABASE}.lang`)
  const result = rawResult as { [key: string]: any }[]

  return result[0].count
}