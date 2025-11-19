import { query } from "../mysql";

export async function CREATE_DATABASE(databaseName: string) {
  return await query(`CREATE DATABASE IF NOT EXISTS ${databaseName};`)
}