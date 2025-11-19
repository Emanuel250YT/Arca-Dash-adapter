/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { IReview, SQLReview } from "@/classes/Review";
import { query } from "../mysql";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL, BASE_QUERY_GET_ALL_COUNT, BASE_QUERY_GET_ALL_WITH_FILTER, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";
import { IPagination } from "@/classes/Filters";
import { IUserProgress, SQLUserProgress } from "@/classes/UserProgress";
import { INotification, SQLNotification } from "@/classes/Notification";

export async function CREATE_NOTIFICATION_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.notification (
  uuid varchar(255) not null,
  source_table varchar(255) not null,
  source_action varchar(255) not null,
  source_ref varchar(255) not null,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  primary key (uuid)
)`);
}



export async function CREATE_NOTIFICATION(notification: INotification) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.BLOG (uuid, user, courses, created_at, currency, provider, promo_code) VALUES
  //   (? , ? , ? , ? , ? , ? , ?)`, [BLOG.uuid, BLOG.user, (BLOG.courses as Array<string>).join(" , "), BLOG.created_at, BLOG.currency, BLOG.provider, BLOG.promo_code]);

  const baseQuery = BASE_CREATE_QUERY(notification, "notification")
  await query(baseQuery.query, baseQuery.values)

  const result = await GET_NOTIFICATION_BY_UUID(notification.uuid)

  return result as SQLNotification
}

export async function GET_NOTIFICATION_BY_UUID(uuid: string) {


  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.BLOG WHERE uuid = ?`, [uuid]);
  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "notification")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLNotification[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}


export async function UPDATE_NOTIFICATION(uuid: string, notification: INotification) {

  const baseQuery = BASE_UPDATE_QUERY(notification, "notification", uuid)
  await query(baseQuery.query, baseQuery.values);
  return await GET_NOTIFICATION_BY_UUID(uuid)
}

export async function DELETE_NOTIFICATION(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "notification")
  await query(baseQuery.query, baseQuery.values);
  return await GET_NOTIFICATION_BY_UUID(uuid) ? true : false
}


export async function GET_ALL_NOTIFICATIONS(pagination?: IPagination) {


  const baseQuery = `
  SELECT *
  FROM \`${process.env.MYSQL_DATABASE}\`.notification
  ORDER BY created_at DESC
`;

  const rawResult = pagination
    ? await query(`${baseQuery} LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`)
    : await query(baseQuery);


  const result = rawResult as null | SQLNotification[]

  if (!rawResult || !result || result.length < 1) return [] as SQLNotification[]

  return result
}



export async function GET_ALL_NOTIFICATION_COUNT(): Promise<number> {

  const baseQuery = BASE_QUERY_GET_ALL_COUNT("notification")
  const rawResult = await query(baseQuery.query)

  // const rawResult = await query(`SELECT COUNT(*) as count FROM ${process.env.MYSQL_DATABASE}.lang`)
  const result = rawResult as { [key: string]: any }[]

  return result[0].count
}