import { Result, ValidationError } from "express-validator";

interface CreateResponseProps {
  success?: boolean;
  message: string;
  data?: object | null;
  errors?: Result<ValidationError> | null;
}

export const createResponse = ({
  message = "Something went wrong",
  errors = null,
  data = null,
  success = true,
}: CreateResponseProps): CreateResponseProps => ({
  success,
  message,
  data,
  errors,
});
