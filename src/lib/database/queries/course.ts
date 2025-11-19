import { ICourse, SQLCourse } from "@/classes/Course";
import { query } from "../mysql";
import { ICoursesFilter, IPagination } from "@/classes/Filters";
import { courseQueryParamsToSQL } from "@/utils/urlParser";
import { BASE_CREATE_QUERY, BASE_QUERY_DELETE_BY_PARAM, BASE_QUERY_GET_ALL_WITH_FILTER, BASE_QUERY_GET_BY_PARAM, BASE_UPDATE_QUERY } from "../baseQueryBuilder";

export async function CREATE_COURSES_TABLE() {
  return await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_DATABASE}.course (
    uuid VARCHAR(255) NOT NULL,
    title VARCHAR(255) NULL,
    description TEXT NULL,
    short_description TEXT NULL,
    difficulty VARCHAR(255) NULL,
    attributes TEXT NULL,
    details TEXT NULL,
    usd_price FLOAT NULL,
    ar_price FLOAT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    enabled BOOLEAN NULL,
    banner TEXT NULL,
    sells INT NOT NULL DEFAULT 0,
    reviews INT NOT NULL DEFAULT 0,
    stars FLOAT NOT NULL DEFAULT 0,
    category varchar(255) not null,
    PRIMARY KEY (uuid)
  )`);
}


export async function CREATE_COURSE(course: ICourse) {
  // await query(`INSERT INTO ${process.env.MYSQL_DATABASE}.course (uuid, title, description, short_description, difficulty, attributes, details, usd_price, ar_price, created_at, updated_at, enabled, banner) VALUES
  //   (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)`, [course.uuid, course.title, course.description || null, course.short_description || null, course.difficulty || null, course.attributes, course.details, course.usd_price || null, course.ar_price || null, course.enabled || null, course.banner || null]);

  const baseQuery = BASE_CREATE_QUERY(course, "course")

  await query(baseQuery.query, baseQuery.values)

  const result = await GET_COURSE_BY_UUID(course.uuid)

  return result as SQLCourse
}

export async function GET_COURSE_BY_UUID(uuid: string) {
  // const rawResult = await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.course WHERE uuid = ?`, [uuid]);
  const baseQuery = BASE_QUERY_GET_BY_PARAM("uuid", uuid, "course")
  const rawResult = await query(baseQuery.query, baseQuery.values)

  const result = rawResult as null | SQLCourse[]

  if (!rawResult || !result || result.length < 1) return null

  const { GET_STUDENTS_COUNT_BY_COURSE } = await import('./order');
  const studentsCount = await GET_STUDENTS_COUNT_BY_COURSE(uuid);

  const courseWithRealSells = {
    ...result[0],
    sells: studentsCount
  };

  return courseWithRealSells
}

export async function GET_ALL_COURSES(pagination?: IPagination, filter?: ICoursesFilter) {
  // const filterContent = filter ? courseQueryParamsToSQL(filter) : null

  // console.log(filterContent)

  // const rawResult = pagination ?
  //   await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.course ${filterContent ? filterContent.sql : ""} LIMIT ${pagination.limit} OFFSET ${pagination.sqlOffset} `, filterContent ? filterContent.params : []) :
  //   await query(`SELECT * FROM ${process.env.MYSQL_DATABASE}.course ${filterContent ? filterContent.sql : ""}`, filterContent ? filterContent.params : []);

  const customFilter = courseQueryParamsToSQL(filter)


  const baseQuery = BASE_QUERY_GET_ALL_WITH_FILTER("course", customFilter?.sql ?? "", pagination)


  const rawResult = await query(baseQuery.query, customFilter?.params ?? [])

  const result = rawResult as null | SQLCourse[]

  if (!rawResult || !result || result.length < 1) return [] as SQLCourse[]

  const { GET_ALL_COURSES_STUDENTS_COUNT } = await import('./order');
  const studentsCount = await GET_ALL_COURSES_STUDENTS_COUNT();

  const coursesWithRealSells = result.map(course => ({
    ...course,
    sells: studentsCount[course.uuid] || 0
  }));

  return coursesWithRealSells
}

export async function GET_ALL_COURSES_COUNT(filter?: ICoursesFilter) {
  const customFilter = courseQueryParamsToSQL(filter)
  
  let queryString = `SELECT COUNT(*) as count FROM ${process.env.MYSQL_DATABASE}.course`;
  let params: Array<string | number> = [];
  
  if (customFilter) {
    const whereClause = customFilter.sql.replace(/ORDER BY.*$/i, '').trim();
    if (whereClause && whereClause !== 'WHERE') {
      queryString += ` ${whereClause}`;
      params = customFilter.params;
    }
  }

  const rawResult = await query(queryString, params);

  const result = rawResult as null | { count: number }[]

  if (!rawResult || !result || result.length < 1) return 0

  return result[0].count
}

export async function DELETE_COURSE_BY_UUID(uuid: string) {
  const baseQuery = BASE_QUERY_DELETE_BY_PARAM("uuid", uuid, "course")
  await query(baseQuery.query, baseQuery.values)
  // await query(`DELETE FROM ${process.env.MYSQL_DATABASE}.course WHERE uuid = ?`, [uuid]);

  return await GET_COURSE_BY_UUID(uuid) ? true : false
}

export async function UPDATE_COURSE(uuid: string, course: ICourse) {
  // await query(
  //   `UPDATE ${process.env.MYSQL_DATABASE}.course
  //    SET title = ?,
  //        description = ?,
  //        short_description = ?,
  //        difficulty = ?,
  //        attributes = ?,
  //        details = ?,
  //        usd_price = ?,
  //        ar_price = ?,
  //        updated_at = NOW(),
  //        enabled = ?,
  //        banner = ?
  //    WHERE uuid = ?`,
  //   [
  //     course.title,
  //     course.description || null,
  //     course.short_description || null,
  //     course.difficulty || null,
  //     (course.attributes as Array<string>).join(","),
  //     (course.details as Array<string>).join(","),
  //     course.usd_price || null,
  //     course.ar_price || null,
  //     course.enabled || null,
  //     course.banner || null,
  //     uuid
  //   ]
  // );

  const baseQuery = BASE_UPDATE_QUERY(course, "course", uuid)
  await query(baseQuery.query, baseQuery.values)

  const result = await GET_COURSE_BY_UUID(uuid);
  return result as SQLCourse;
}

export async function UPDATE_COURSE_ENABLED(uuid: string, enabled: boolean) {
  await query(
    `UPDATE ${process.env.MYSQL_DATABASE}.course SET enabled = ? WHERE uuid = ?`,
    [enabled, uuid]
  );
  return await GET_COURSE_BY_UUID(uuid);
}


