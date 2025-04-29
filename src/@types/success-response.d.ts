export interface SuccessResponse<T = null> {
  message: string;
  data?: T;
}
