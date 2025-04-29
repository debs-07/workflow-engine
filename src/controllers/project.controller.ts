import { NextFunction, Request, Response } from "express";

import { createResponse } from "../helpers/response.helper.ts";
import {
  createProjectService,
  fetchProjectsService,
  fetchProjectDetailsService,
  updateProjectDetailsService,
  deleteProjectService,
} from "../services/project.service.ts";

export const fetchProjects = async (req: Request, res: Response, _next: NextFunction) => {
  const { message, data } = await fetchProjectsService(req.userId);

  res.status(200).json(
    createResponse({
      message,
      data,
    }),
  );
};

export const createProject = async (req: Request, res: Response, _next: NextFunction) => {
  const { name, description } = req.body;
  const { message } = await createProjectService(name, description, req.userId);

  res.status(201).json(
    createResponse({
      message,
    }),
  );
};

export const fetchProjectDetails = async (req: Request, res: Response, _next: NextFunction) => {
  const { message, data } = await fetchProjectDetailsService(req.params.id, req.userId);

  res.status(200).json(
    createResponse({
      message,

      data,
    }),
  );
};

export const updateProjectDetails = async (req: Request, res: Response, _next: NextFunction) => {
  const { name, description } = req.body;
  const { message } = await updateProjectDetailsService(req.params.id, name, description, req.userId);

  res.status(200).json(
    createResponse({
      message,
    }),
  );
};

export const deleteProject = async (req: Request, res: Response, _next: NextFunction) => {
  const { message } = await deleteProjectService(req.params.id, req.userId);

  res.status(200).json(
    createResponse({
      message,
    }),
  );
};
