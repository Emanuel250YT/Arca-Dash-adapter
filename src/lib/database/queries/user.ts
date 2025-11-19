/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser, SQLUser } from "@/classes/User";
import { query } from "../mysql";
import { IPagination } from "@/classes/Filters";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";

export async function CREATE_USERS_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.user (
  uuid VARCHAR(255) not null,
  password varchar(255) not null,
  email varchar(255) not null,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  role varchar(255) not null default ?,
  first_name varchar(255) null,
  last_name varchar(255) null,
  primary key (uuid)
)`, ["user"]);
}


export async function CREATE_USER(user: IUser) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.user (uuid, password, email, created_at, updated_at, role, first_name, last_name) VALUES
  //   (?, ?, ?, NOW(), NOW(), ?, ?, ? )`, [user.uuid, user.password, user.email, "user", user.first_name || null, user.last_name || null]);

  const baseQuery = BASE_CREATE_QUERY(user, "user")
  await query(baseQuery.query, baseQuery.values)

  const result = await GET_USER_BY_UUID(user.uuid)

  return result as SQLUser
}

export async function GET_USER_BY_UUID(uuid: string) {
  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.user WHERE uuid = ?`, [uuid]);

  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "user")
  const rawResult = await query(baseQuery.query, baseQuery.values);

  const result = rawResult as null | SQLUser[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}



export async function GET_USER_BY_EMAIL(email: string) {
  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.user
  //   WHERE email = ?`, [email])

  const baseQuery = BASE_QUERY_GET_BY_PARAM("email", email, "user")
  const rawResult = await query(baseQuery.query, baseQuery.values);

  const result = rawResult as null | SQLUser[]

  if (!rawResult || !result || result.length < 1) return null


  return result[0]
}


export async function GET_ALL_USERS(pagination?: IPagination, filters?: { contain?: string }) {
  let sqlQuery = `SELECT * FROM ${process.env.MYSQL_DATABASE}.user`;
  const values: (string | number)[] = [];
  
  if (filters?.contain) {
    sqlQuery += ` WHERE (email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR uuid LIKE ?)`;
    const searchTerm = `%${filters.contain}%`;
    values.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  if (pagination) {
    sqlQuery += ` LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`;
  }
  
  const rawResult = await query(sqlQuery, values);
  const result = rawResult as SQLUser[];
  
  return result;
}

export async function GET_ALL_USERS_COUNT(filters?: { contain?: string }): Promise<number> {
  let sqlQuery = `SELECT COUNT(*) as count FROM ${process.env.MYSQL_DATABASE}.user`;
  const values: (string | number)[] = [];
  
  if (filters?.contain) {
    sqlQuery += ` WHERE (email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR uuid LIKE ?)`;
    const searchTerm = `%${filters.contain}%`;
    values.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  const rawResult = await query(sqlQuery, values);
  const result = rawResult as { [key: string]: any }[];

  return result[0].count;
}


export async function UPDATE_USER(uuid: string, user: IUser) {


  const baseQuery = BASE_UPDATE_QUERY(user, "user", uuid);
  await query(baseQuery.query, baseQuery.values);

  const result = await GET_USER_BY_UUID(uuid);
  return result as SQLUser;
}


export async function DELETE_USER_BY_UUID(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "user")

  await query(baseQuery.query, baseQuery.values);


  return await GET_USER_BY_UUID(uuid) ? true : false
}