export class AppError extends Error {
  public readonly status: number;
  public readonly isOperational: boolean;

  constructor(status: number, message: string, isOperational = true) {
    super(message); // Update Error class message property
    this.status = status;
    this.isOperational = isOperational;
    this.name = this.constructor.name; // Update name property from 'Error' to the <Custom Error Name>
    Error.captureStackTrace(this, this.constructor); // Capture the current call stack at the point where custom error object is created(Services,Controllers etc)
  }
}
// Unauthorized
export class AuthError extends AppError {
  constructor(message: string) {
    super(401, message);
  }
}

// Conflict
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

// Bad Request
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

// Not Found
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}
