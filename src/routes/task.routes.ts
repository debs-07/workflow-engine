import express from "express";

import {
  createTask,
  deleteTask,
  fetchTaskDetails,
  fetchTasks,
  updateTaskDetails,
} from "../controllers/task.controller.ts";
import { validateTaskInput, validateTaskId } from "../middlewares/validate.middleware.ts";

const router = express.Router();

router.get("/", fetchTasks);
router.post("/", validateTaskInput, createTask);
router.get("/:id", validateTaskId, fetchTaskDetails);
router.put("/:id", validateTaskId, validateTaskInput, updateTaskDetails);
router.delete("/:id", validateTaskId, deleteTask);

export default router;
