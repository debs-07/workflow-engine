import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.config.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT;
if (!port) throw new Error("PORT is required");

app.use(cors());

app.use(errorHandler); // Error-handling middleware

(async () => {
  try {
    await connectDB();
    app.listen(port, () =>
      console.log(`Workflow engine running on port ${port}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit();
  }
})();
