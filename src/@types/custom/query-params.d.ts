export interface Pagination {
  page: number;
  limit: number;
}

export interface Sorting {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Search {
  search?: { [field: string]: string };
}

export interface FetchFilters extends Pagination, Sorting, Search {}
