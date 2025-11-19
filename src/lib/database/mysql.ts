import { CREATE_DATABASE } from "@/lib/database/queries/database";
import { CREATE_USERS_TABLE } from "@/lib/database/queries/user";
import mysql, { PoolOptions } from "mysql2/promise";
import { CREATE_LANG_TABLE } from "./queries/lang";
import { CREATE_COMPONENT_TABLE } from "./queries/component";
import { CREATE_VIEW_TABLE } from "./queries/view";
import { CREATE_COURSES_TABLE } from "./queries/course";
import { CREATE_REVIEW_TABLE } from "./queries/review";
import { CREATE_BLOG_TABLE } from "./queries/blog";
import { CREATE_ORDER_TABLE } from "./queries/order";
import { CREATE_COURSE_CONTENT_TABLE } from "./queries/courseContent";
import { CREATE_USER_PROGRESS_TABLE } from "./queries/userProgress";
import { CREATE_NOTIFICATION_TABLE } from "./queries/notification";
import { CREATE_PROMO_CODE_TABLE } from "./queries/promoCode";
import { CREATE_FILEDATA_TABLE } from "./queries/fileData";
import { CREATE_RESET_PASSWORD_TABLE } from "./queries/resetPassword";

const access: PoolOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: Number(process.env.MYSQL_PORT)
}

let setupFinished = false

export const connection = mysql.createPool(access)

export async function query(query: string, values = [] as Array<unknown>) {
  try {
    const [results] = await connection.query(query, values)

    return results
  } catch (err) {
    if (err) {

      console.log(err)

      return null
    }
  }
  return null
}

export async function setup() {

  if (setupFinished) return;

  console.log("Setup database!")

  await CREATE_DATABASE(process.env.MYSQL_DATABASE!)
  await CREATE_USERS_TABLE()
  await CREATE_LANG_TABLE()
  await CREATE_COMPONENT_TABLE()
  await CREATE_VIEW_TABLE()
  await CREATE_COURSES_TABLE()
  await CREATE_REVIEW_TABLE()
  await CREATE_BLOG_TABLE()
  await CREATE_ORDER_TABLE()
  await CREATE_COURSE_CONTENT_TABLE()
  await CREATE_USER_PROGRESS_TABLE()
  await CREATE_NOTIFICATION_TABLE()
  await CREATE_PROMO_CODE_TABLE()
  await CREATE_FILEDATA_TABLE()
  await CREATE_RESET_PASSWORD_TABLE()

  setupFinished = true
}
