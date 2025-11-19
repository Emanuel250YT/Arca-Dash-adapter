import { IPagination } from "@/classes/Filters"
import { CREATE_NOTIFICATION } from "./queries/notification"
import { v4 } from "uuid"

export function BASE_CREATE_QUERY(content: unknown, table: string) {

  const keys = [] as Array<string>
  const values = [] as Array<string | number | boolean | null>

  Object.entries(content as object).map(([key, value]) => {
    keys.push(key)
    if (Array.isArray(value)) {
      values.push(value.join(', '))
    } else {
      values.push(value)
    }
  })

  if (table != "notification") CREATE_NOTIFICATION({
    uuid: v4(),
    source_action: "create",
    source_ref: (content as { uuid: string }).uuid,
    source_table: table
  })

  return {
    keys: keys,
    values: values,
    query: `INSERT INTO ${process.env.MYSQL_DATABASE}.${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`
  }
}

export function BASE_UPDATE_QUERY(content: unknown, table: string, uuid: string) {

  const keys = [] as Array<string>
  const values = [] as Array<string | number | boolean | null>

  Object.entries(content as object).map(([key, value]) => {
    keys.push(key)
    if (Array.isArray(value)) {
      values.push(value.join(', '))
    } else {
      values.push(value)
    }
  })

  values.push(uuid)

  CREATE_NOTIFICATION({
    uuid: v4(),
    source_action: "patch",
    source_ref: uuid,
    source_table: table
  })

  return {
    keys: keys,
    values: values,
    query: `UPDATE ${process.env.MYSQL_DATABASE}.${table} SET ${keys.map((key) => `${key} = ?`).join(", ")} WHERE uuid = ?`
  }
}

export function BASE_QUERY_GET_BY_PARAM(paramKey: string, paramValue: string, table: string) {

  return {
    keys: [paramKey],
    values: [paramValue],
    query: `SELECT * FROM ${process.env.MYSQL_DATABASE}.${table} WHERE ${paramKey} = ?`
  }
}

export function BASE_QUERY_DELETE_BY_PARAM(paramKey: string, paramValue: string, table: string) {

  CREATE_NOTIFICATION({
    uuid: v4(),
    source_action: "delete",
    source_ref: paramValue,
    source_table: table
  })

  return {
    keys: [paramKey],
    values: [paramValue],
    query: `DELETE FROM ${process.env.MYSQL_DATABASE}.${table} WHERE ${paramKey} = ?`
  }
}

export function BASE_QUERY_GET_ALL(table: string, pagination?: IPagination) {

  return {
    keys: [],
    values: [],
    query: `SELECT * FROM ${process.env.MYSQL_DATABASE}.${table} ${pagination ? `LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}` : ""}`
  }
}

export function BASE_QUERY_GET_ALL_WITH_FILTER(table: string, filter: string, pagination?: IPagination) {
  return {
    keys: [],
    values: [],
    query: `SELECT * FROM ${process.env.MYSQL_DATABASE}.${table} ${filter} ${pagination ? `LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}` : ""}`
  }

}



export function BASE_QUERY_GET_ALL_COUNT(table: string) {

  return {
    keys: [],
    values: [],
    query: `SELECT COUNT(*) as count FROM ${process.env.MYSQL_DATABASE}.${table}`
  }
}