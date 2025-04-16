import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT;
if (!port) throw new Error("PORT is required");

app.use(cors());

app.listen(port, () => {
  console.log(`Workflow engine running on port ${port}`);
});
