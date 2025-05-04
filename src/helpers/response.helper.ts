export interface CreateResponseProps {
  success?: boolean;
  message: string;
  data?: object | null;
  meta?: object | null;
}

export const createResponse = ({
  message = "Something went wrong",
  success = true,
  data = null,
  meta = null,
}: CreateResponseProps): CreateResponseProps => ({
  success,
  message,
  data,
  meta,
});
