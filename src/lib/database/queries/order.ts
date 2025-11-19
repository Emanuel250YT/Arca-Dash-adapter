// import { IReview, SQLReview } from "@/classes/Review";
import { IOrder, SQLOrder } from "@/classes/Order";
import { SQLUser } from "@/classes/User";
import { query } from "../mysql";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL, BASE_QUERY_GET_ALL_COUNT, BASE_QUERY_GET_ALL_WITH_FILTER, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";
import { IPagination } from "@/classes/Filters";

export async function CREATE_ORDER_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.order (
  uuid varchar(255) not null,
  user varchar(255) not null,
  courses varchar(255) not null,
  created_at TIMESTAMP not null default CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  currency varchar(255) not null,
  provider varchar(255) not null,
  promo_code varchar(255),
  paid boolean not null default false,
  payment_id varchar(255),
  partialContent TEXT,
  partialTotal float,
  type varchar(255),
  primary key (uuid)
)`);
}



export async function CREATE_ORDER(order: IOrder) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.order (uuid, user, courses, created_at, currency, provider, promo_code) VALUES
  //   (? , ? , ? , ? , ? , ? , ?)`, [order.uuid, order.user, (order.courses as Array<string>).join(" , "), order.created_at, order.currency, order.provider, order.promo_code]);

  const baseQuery = BASE_CREATE_QUERY(order, "order")
  await query(baseQuery.query, baseQuery.values)

  const result = await GET_ORDER_BY_UUID(order.uuid)

  return result as SQLOrder
}

export async function GET_ORDER_BY_UUID(uuid: string) {


  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.order WHERE uuid = ?`, [uuid]);
  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "order")
  const rawResult = await query(baseQuery.query, baseQuery.values)


  const result = rawResult as null | SQLOrder[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}


export async function GET_PAID_ORDERS_BY_USER_AND_COURSE(user: string, course: string, pagination?: IPagination) {
  const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("order", "WHERE user = ? AND courses LIKE ? AND paid = ?", pagination)
  // const rawResult = pagination ? await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`) : await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view`)
  const rawResult = await query(baseQuery.query, [user, `%${course}%`, true])

  const result = rawResult as SQLOrder[]

  return result
}

export async function GET_PAID_ORDERS_BY_USER(user: string, pagination?: IPagination) {
  const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("order", "WHERE user = ? AND paid = ?", pagination)
  // const rawResult = pagination ? await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`) : await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view`)
  const rawResult = await query(baseQuery.query, [user, true])

  const result = rawResult as SQLOrder[]

  return result
}

export async function GET_ORDERS_BY_USER(user: string, pagination?: IPagination) {
  const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("order", "WHERE user = ?", pagination)
  // const rawResult = pagination ? await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`) : await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view`)
  const rawResult = await query(baseQuery.query, [user])

  const result = rawResult as SQLOrder[]

  return result
}


export async function GET_ORDER_BY_PAYMENT_ID(uuid: string) {


  const baseQuery = BASE_QUERY_GET_BY_PARAM("payment_id", uuid, "order")
  const rawResult = await query(baseQuery.query, baseQuery.values)


  const result = rawResult as null | SQLOrder[]

  if (!rawResult || !result || result.length < 1) return null

  return result[0]
}


export async function UPDATE_ORDER(uuid: string, order: IOrder) {
  const orderToUpdate = {
    courses: Array.isArray(order.courses) 
      ? order.courses.map(course => {
          if (typeof course === 'object' && course !== null && 'uuid' in course) {
            return (course as {uuid: string}).uuid;
          }
          return String(course);
        }).join(",")
      : order.courses,
    currency: order.currency,
    provider: order.provider,
    promo_code: order.promo_code,
    paid: order.paid === true
  };

  const baseQuery = BASE_UPDATE_QUERY(orderToUpdate, "order", uuid)
  await query(baseQuery.query, baseQuery.values);

  if (orderToUpdate.paid) {
    const courses = Array.isArray(order.courses) 
      ? order.courses.map(course => {
          if (typeof course === 'object' && course !== null && 'uuid' in course) {
            return (course as {uuid: string}).uuid;
          }
          return String(course);
        })
      : order.courses.split(",");
    for (const courseId of courses) {
      if (typeof courseId === 'string') {
        await query(
          `UPDATE ${process.env.MYSQL_DATABASE}.course 
           SET sells = sells + 1 
           WHERE uuid = ?`,
          [courseId.trim()]
        );
      }
    }
  }

  return await GET_ORDER_BY_UUID(uuid)
}

export async function DELETE_ORDER(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "order")
  await query(baseQuery.query, baseQuery.values);
  return await GET_ORDER_BY_UUID(uuid) ? true : false
}



export async function GET_ORDER_BY_MAIL(email: string) {


  const baseQuery = BASE_QUERY_GET_BY_PARAM("email", email, "order")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLOrder[]

  if (!rawResult || !result || result.length < 1) return null
  return result[0]
}

export async function GET_ALL_ORDERS(pagination?: IPagination) {
  const baseQuery = BASE_QUERY_GET_ALL("order", pagination)
  // const rawResult = pagination ? await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`) : await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.view`)
  const rawResult = await query(baseQuery.query)

  const result = rawResult as SQLOrder[]

  return result
}


export async function GET_ALL_MOTH_PAID_ORDERS(pagination?: IPagination) {
  // const baseQuery = BASE_QUERY_GET_ALL("order", pagination)
  const baseQuery = `
  SELECT *
  FROM \`${process.env.MYSQL_DATABASE}\`.order
  WHERE MONTH(created_at) = MONTH(CURDATE())
    AND YEAR(created_at) = YEAR(CURDATE())
    AND paid = true
  ORDER BY created_at DESC
`;

  const rawResult = pagination
    ? await query(`${baseQuery} LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`)
    : await query(baseQuery);

  // const rawResult = await query(baseQuery.query)

  const result = rawResult as SQLOrder[]

  return result
}




export async function GET_ALL_ORDERS_COUNT() {

  const baseQuery = BASE_QUERY_GET_ALL_COUNT("order")

  const rawResult = await query(baseQuery.query)
  const result = rawResult as { count: number }[]

  if (!rawResult || !result || result.length < 1) return 0

  return result[0].count
}

export async function GET_STUDENTS_COUNT_BY_COURSE(courseUuid: string): Promise<number> {
  const sqlQuery = `
    SELECT COUNT(DISTINCT user) as student_count
    FROM ${process.env.MYSQL_DATABASE}.order 
    WHERE courses LIKE ? AND paid = true
  `;
  
  const rawResult = await query(sqlQuery, [`%${courseUuid}%`]);
  const result = rawResult as { student_count: number }[];

  if (!rawResult || !result || result.length < 1) return 0;

  return result[0].student_count;
}

export async function GET_ALL_COURSES_STUDENTS_COUNT(): Promise<{ [courseUuid: string]: number }> {
  const sqlQuery = `
    SELECT 
      TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(courses, ',', numbers.n), ',', -1)) as course_uuid,
      COUNT(DISTINCT user) as student_count
    FROM ${process.env.MYSQL_DATABASE}.order 
    CROSS JOIN (
      SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
    ) numbers
    WHERE paid = true 
      AND CHAR_LENGTH(courses) - CHAR_LENGTH(REPLACE(courses, ',', '')) >= numbers.n - 1
    GROUP BY course_uuid
  `;
  
  const rawResult = await query(sqlQuery);
  const result = rawResult as { course_uuid: string; student_count: number }[];

  if (!rawResult || !result) return {};

  const courseCounts: { [courseUuid: string]: number } = {};
  result.forEach(row => {
    if (row.course_uuid && row.course_uuid.trim()) {
      courseCounts[row.course_uuid.trim()] = row.student_count;
    }
  });

  return courseCounts;
}

export async function GET_STUDENTS_OF_COURSE(
  courseUuid: string,
  pagination?: IPagination,
  contain?: string
): Promise<SQLUser[]> {
  const conditions: string[] = [
    `o.paid = true`,
    `o.courses LIKE ?`
  ];
  const values: Array<string | number | boolean> = [
    `%${courseUuid}%`
  ];

  if (contain) {
    conditions.push(`(u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)`);
    const search = `%${contain}%`;
    values.push(search, search, search);
  }

  let sqlQuery = `
    SELECT DISTINCT u.*
    FROM ${process.env.MYSQL_DATABASE}.\`order\` o
    INNER JOIN ${process.env.MYSQL_DATABASE}.\`user\` u 
      ON u.uuid = o.user OR u.email = o.user
    WHERE ${conditions.join(" AND ")}
    ORDER BY u.created_at DESC
  `;

  if (pagination) {
    sqlQuery += ` LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset}`;
  }

  const rawResult = await query(sqlQuery, values);
  const result = rawResult as SQLUser[];
  return result;
}

export async function GET_STUDENTS_OF_COURSE_COUNT(
  courseUuid: string,
  contain?: string
): Promise<number> {
  const conditions: string[] = [
    `o.paid = true`,
    `o.courses LIKE ?`
  ];
  const values: Array<string | number | boolean> = [
    `%${courseUuid}%`
  ];

  if (contain) {
    conditions.push(`(u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)`);
    const search = `%${contain}%`;
    values.push(search, search, search);
  }

  const sqlQuery = `
    SELECT COUNT(DISTINCT u.uuid) as count
    FROM ${process.env.MYSQL_DATABASE}.\`order\` o
    INNER JOIN ${process.env.MYSQL_DATABASE}.\`user\` u 
      ON u.uuid = o.user OR u.email = o.user
    WHERE ${conditions.join(" AND ")}
  `;

  const rawResult = await query(sqlQuery, values);
  const result = rawResult as { count: number }[];
  if (!rawResult || !result || result.length < 1) return 0;
  return result[0].count;
}
