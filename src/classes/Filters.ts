export interface IPagination {
  limit: number
  page: number
  sqlOffset: number
}

export interface ISearchFilter {
  sortBy?: string
}

export interface ICoursesFilter extends ISearchFilter {
  min?: number
  max?: number
  difficulty?: Array<string>,
  currency?: string,

  contain?: string
  enabled?: boolean
}

export interface IBlogFilter extends ISearchFilter {
  category?: string,
  contain?: string,
  hyper_type?: string,
}