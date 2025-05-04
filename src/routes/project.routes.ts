import express from "express";

import {
  createProject,
  fetchProjects,
  fetchProjectDetails,
  updateProjectDetails,
  deleteProject,
} from "../controllers/project.controller.ts";
import { validateProjectId, validateProjectInput, verifyFetchQuery } from "../middlewares/validate.middleware.ts";

const router = express.Router();

router.get("/", verifyFetchQuery, fetchProjects);
router.post("/", validateProjectInput, createProject);
router.get("/:id", validateProjectId, fetchProjectDetails);
router.put("/:id", validateProjectId, validateProjectInput, updateProjectDetails);
router.delete("/:id", validateProjectId, deleteProject);

export default router;
