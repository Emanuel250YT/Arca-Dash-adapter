import { IBlogFilter, ICoursesFilter, IPagination } from "@/classes/Filters";

export function urlToPagination(url: string) {
  const { searchParams } = new URL(url);
  const limit = searchParams.get("limit") || null
  const page = searchParams.get("page") || null

  if (!limit || !page || Number.isNaN(limit) || Number.isNaN(page)) return null
  let sqlOffset = (Number(page) - 1) * Number(limit)
  if (sqlOffset < 0) sqlOffset = 0;
  return { limit: Number(limit), page: Number(page), sqlOffset: sqlOffset } as IPagination
}

export function getCourseQueryParams(url: string) {

  const { searchParams } = new URL(url);

  const difficulty = searchParams.get("difficulty")
  const min = searchParams.get("min")
  const max = searchParams.get("max")
  const currency = searchParams.get("currency")
  const sortBy = searchParams.get("sortBy")
  const contain = searchParams.get("contain")

  const filter: ICoursesFilter = {}

  if (max && !Number.isNaN(max)) filter.max = Number(max)
  if (min && !Number.isNaN(min)) filter.min = Number(min)
  if (currency) filter.currency = currency
  if (difficulty) filter.difficulty = difficulty.split("|").filter(v => v && v.length > 0)
  if (sortBy) filter.sortBy = sortBy
  if (contain) filter.contain = contain

  return filter

}

export function courseQueryParamsToSQL(course?: ICoursesFilter) {

  const arrValues: Array<string> = []
  const params: Array<string | number> = []
  let sortBy = ""



  const sortList: Map<string, string> = new Map()
    .set("popular", "ORDER BY sells DESC")
    .set("latest", "ORDER BY created_at DESC")
    .set("max_price", "ORDER BY %var%_price DESC")
    .set("min_price", "ORDER BY %var%_price ASC")

  if (!course) return {
    sql: "",
    params: []
  }

  if (course.difficulty && course.difficulty.length > 0) {
    const diffText = course.difficulty.map(v => {
      params.push(v)
      return "difficulty = ?"

    })
    arrValues.push(diffText.join(" OR "))
  }

  if (course.max && course.currency) {
    arrValues.push(course.currency + "_price < ?")
    params.push(course.max)
  }

  if (course.min && course.currency) {
    arrValues.push(course.currency + "_price > ?")
    params.push(course.min)
  }

  if (course.contain) {
    course.contain = course.contain.toLowerCase()
    arrValues.push(`(title LIKE ? OR description LIKE ? OR short_description LIKE ? OR details LIKE ? OR attributes LIKE ?)`)
    params.push(...[course.contain, course.contain, course.contain, course.contain, course.contain].map(v => `%${v}%`))
  }

  if (typeof course.enabled === "boolean") {
    arrValues.push("enabled = ?")
    params.push(course.enabled ? 1 : 0)
  }

  if (course.sortBy && sortList.has(course.sortBy.toLowerCase())) {
    const sortValue = sortList.get(course.sortBy.toLowerCase()) + "";
    
    if (course.sortBy.toLowerCase() === "popular" || course.sortBy.toLowerCase() === "latest") {
      sortBy = sortValue;
    } else if (course.currency) {
      sortBy = sortValue.replaceAll("%var%", course.currency);
    }
  }

  const response = {
    params: params,
    sql: `${params.length > 0 ? "WHERE" : ""}  ${arrValues.join(" AND ")} ${sortBy}`
  }

  if (!course.difficulty && !course.max && !course.min && !course.currency && !course.contain && typeof course.enabled !== "boolean") return null
  if (params.length == 0 && sortBy.length == 0) return null

  return response
}



export function getBlogQueryParams(url: string) {

  const { searchParams } = new URL(url);

  const category = searchParams.get("category")
  const hyper_type = searchParams.get("hyper_type")

  const sortBy = searchParams.get("sortBy")
  const contain = searchParams.get("contain")

  const filter: IBlogFilter = {}


  if (sortBy) filter.sortBy = sortBy
  if (contain) filter.contain = contain
  if (category) filter.category = category
  if (hyper_type) filter.hyper_type = hyper_type

  return filter

}

export function blogQueryParamsToSQL(blog?: IBlogFilter) {

  const arrValues: Array<string> = []
  const params: Array<string | number> = []
  let sortBy = ""

  const sortList: Map<string, string> = new Map()
    .set("older", "ORDER BY created_at ASC")
    .set("latest", "ORDER BY created_at DESC")
    .set("popular", "ORDER BY views DESC")

  if (!blog) return {
    sql: "",
    params: []
  }

  if (blog.category) {
    arrValues.push("category = ?")
    params.push(blog.category)
  }

  if (blog.hyper_type) {
    arrValues.push("hyper_type = ?")
    params.push(blog.hyper_type)
  }

  if (blog.contain) {
    blog.contain = blog.contain.toLowerCase()
    arrValues.push(`(title LIKE ? OR content_subtype LIKE ? OR text_content LIKE ? OR short_text_content LIKE ? OR content_type LIKE ?)`)
    const arr = new Array(5).fill(`%${blog.contain}%`)

    params.push(...arr)
  }

  if (blog.sortBy && sortList.has(blog.sortBy.toLowerCase())) {
    sortBy = (sortList.get(blog.sortBy.toLowerCase()) + "")
  }

  const response = {
    params: params,
    sql: `${params.length > 0 ? "WHERE" : ""}  ${arrValues.join(" AND ")} ${sortBy}`
  }

  if (!blog.category && !blog.contain && !blog.hyper_type && !blog.sortBy) return null
  if (params.length == 0 && sortBy.length == 0) return null

  return response
}