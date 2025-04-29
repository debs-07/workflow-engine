export class AppError extends Error {
  public readonly status: number;
  public readonly userMessage: string;
  public readonly isOperational: boolean;

  constructor(status: number, errMessage: string, userMessage?: string, isOperational = true) {
    super(errMessage); // Update Error class message property
    this.status = status;
    this.userMessage = userMessage ?? errMessage;
    this.isOperational = isOperational;
    this.name = this.constructor.name; // Update name property from 'Error' to the <Custom Error Name>
    Error.captureStackTrace(this, this.constructor); // Capture the current call stack at the point where custom error object is created(Services,Controllers etc)
  }
}
// Unauthorized
export class AuthError extends AppError {
  constructor(errMessage: string) {
    super(401, errMessage);
  }
}

// Conflict
export class ConflictError extends AppError {
  constructor(errMessage: string) {
    super(409, errMessage);
  }
}

// Bad Request
export class ValidationError extends AppError {
  constructor(errMessage: string) {
    super(400, errMessage);
  }
}

// Not Found
export class NotFoundError extends AppError {
  constructor(errMessage: string) {
    super(404, errMessage);
  }
}

export class CustomError extends AppError {
  constructor(status: number, errMessage: string, userMessage: string = "Internal server error") {
    super(status, errMessage, userMessage);
  }
}
