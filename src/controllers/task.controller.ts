import { NextFunction, Request, Response } from "express";

import { ITask } from "../models/core/task.model.ts";
import { FetchFilters } from "../@types/custom/index";
import { createResponse } from "../helpers/response.helper.ts";
import {
  createTaskService,
  deleteTaskService,
  fetchTaskDetailsService,
  fetchTasksService,
  updateTaskDetailsService,
} from "../services/task.service.ts";

export const fetchTasks = async (req: Request, res: Response, _next: NextFunction) => {
  const projectId = typeof req.query.projectId === "string" ? req.query.projectId : null;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const fetchFilters: FetchFilters = { page, limit };

  const { message, data, totalData, totalPages } = await fetchTasksService(req.userId, projectId, fetchFilters);

  const meta = { page, limit, totalPages, totalData };

  res.status(200).json(createResponse({ message, data, meta }));
};

export const createTask = async (req: Request, res: Response, _next: NextFunction) => {
  const task: ITask = req.body.task;
  const { message } = await createTaskService({ ...task, userId: req.userId });

  res.status(201).json(createResponse({ message }));
};

export const fetchTaskDetails = async (req: Request, res: Response, _next: NextFunction) => {
  const { message, data } = await fetchTaskDetailsService(req.params.id, req.userId);

  res.status(200).json(createResponse({ message, data }));
};

export const updateTaskDetails = async (req: Request, res: Response, _next: NextFunction) => {
  const task: ITask = req.body.task;
  const { message } = await updateTaskDetailsService(req.params.id, { ...task, userId: req.userId });

  res.status(200).json(createResponse({ message }));
};

export const deleteTask = async (req: Request, res: Response, _next: NextFunction) => {
  const { message } = await deleteTaskService(req.params.id, req.userId);

  res.status(200).json(createResponse({ message }));
};
