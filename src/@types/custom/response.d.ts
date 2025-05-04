export interface SuccessResponse<T = null> {
  message: string;
  data?: T;
}

export interface SuccessResponseWithPagination<T = null> extends SuccessResponse<T> {
  totalData: number;
  totalPages: number;
}
