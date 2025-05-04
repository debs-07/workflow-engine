import express from "express";

import {
  createProject,
  fetchProjects,
  fetchProjectDetails,
  updateProjectDetails,
  deleteProject,
} from "../controllers/project.controller.ts";
import { validateProjectId, validateProjectInput, verifyFetchFilter } from "../middlewares/validate.middleware.ts";

const router = express.Router();

router.get("/", verifyFetchFilter, fetchProjects);
router.post("/", validateProjectInput, createProject);
router.get("/:id", validateProjectId, fetchProjectDetails);
router.put("/:id", validateProjectId, validateProjectInput, updateProjectDetails);
router.delete("/:id", validateProjectId, deleteProject);

export default router;
