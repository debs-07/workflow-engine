import { CustomJwtPayload } from "./jwt";

// Modify the global Express types without overriding the express module’s exports
declare global {
  namespace Express {
    interface Request {
      userId?: CustomJwtPayload["userId"];
    }
  }
}
