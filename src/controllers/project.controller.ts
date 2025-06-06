import { NextFunction, Request, Response } from "express";

import { IProject } from "../models/core/project.model.ts";
import { FetchFilters, Search } from "../@types/custom/index";
import { createResponse } from "../helpers/response.helper.ts";
import {
  createProjectService,
  fetchProjectsService,
  fetchProjectDetailsService,
  updateProjectDetailsService,
  deleteProjectService,
} from "../services/project.service.ts";

export const fetchProjects = async (
  req: Request<unknown, unknown, unknown, FetchFilters>,
  res: Response,
  _next: NextFunction,
) => {
  const { page, limit, sortOrder, sortBy, ...rest } = req.query;
  const search = rest as Search["search"];

  const { message, data, totalData, totalPages } = await fetchProjectsService(req.userId, {
    page,
    limit,
    sortOrder,
    sortBy,
    search,
  });

  const meta = { page: Number(page || 1), limit: Number(limit || 10), totalData, totalPages };

  res.status(200).json(createResponse({ message, data, meta }));
};

export const createProject = async (req: Request, res: Response, _next: NextFunction) => {
  const project: IProject = req.body.project;
  const { message } = await createProjectService({ ...project, userId: req.userId });

  res.status(201).json(createResponse({ message }));
};

export const fetchProjectDetails = async (req: Request, res: Response, _next: NextFunction) => {
  const { message, data } = await fetchProjectDetailsService(req.params.id, req.userId);

  res.status(200).json(createResponse({ message, data }));
};

export const updateProjectDetails = async (req: Request, res: Response, _next: NextFunction) => {
  const project: IProject = req.body.project;
  const { message } = await updateProjectDetailsService(req.params.id, { ...project, userId: req.userId });

  res.status(200).json(createResponse({ message }));
};

export const deleteProject = async (req: Request, res: Response, _next: NextFunction) => {
  const { message } = await deleteProjectService(req.params.id, req.userId);

  res.status(200).json(createResponse({ message }));
};
