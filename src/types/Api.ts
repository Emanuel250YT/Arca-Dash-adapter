/* Dashboard Stats */
export interface CountResponse {
  body: {
    count: number;
  };
}

export interface SalesResponse {
  body: unknown[];
}

export interface DashboardStats {
  users: number;
  courses: number;
  sales: number;
  blogs: number;
}

/* Courses */
export interface DashboardStats {
  users: number;
  courses: number;
  sales: number;
  blogs: number;
  earnings: Record<string, number>;
}

/* Users */
export interface UsersQueryParams {
  contain: string;
}

/* Courses */
export interface CoursesQueryParams {
  contain: string;
  difficulty?: string;
  currency?: string;
  sortBy?: string;
}

/* I18n interfaces */
export interface SaveSectionParams<
  TContent extends Record<string, Record<string, string | undefined>>
> {
  activeLanguage?: string;
  defaultKey: string;
  selectedContent: TContent;
  setIsSubmitting: (value: boolean) => void;
  fetchSectionContent: () => Promise<void>;
  viewName?: string;
}

export interface LangType {
  uuid: string;
  lang: string;
  content: string;
}

export interface ComponentType {
  uuid: string;
  itemKey: string;
  langs?: LangType[];
}
