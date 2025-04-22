import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.config.ts";
import { validateEnvVars } from "./config/env.config.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
import authRoutes from "./routes/auth.routes.ts";

const app = express();

app.use(cors());
app.use(json());

app.use("/auth", authRoutes);

app.use(errorHandler); // Error-handling middleware

(async () => {
  try {
    dotenv.config(); // Load environment variables
    validateEnvVars(); // Check if required environment variables are set

    await connectDB();

    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Workflow engine running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit();
  }
})();
