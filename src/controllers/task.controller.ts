import { NextFunction, Request, Response } from "express";

import { ITask } from "../models/core/task.model.ts";
import { FetchFilters, Search } from "../@types/custom/index";
import { createResponse } from "../helpers/response.helper.ts";
import {
  createTaskService,
  deleteTaskService,
  fetchTaskDetailsService,
  fetchTasksService,
  updateTaskDetailsService,
} from "../services/task.service.ts";

export const fetchTasks = async (
  req: Request<unknown, unknown, unknown, FetchFilters>,
  res: Response,
  _next: NextFunction,
) => {
  const { page, limit, sortOrder, sortBy, ...rest } = req.query;
  const search = rest as Search["search"];

  const { message, data, totalData, totalPages } = await fetchTasksService(req.userId, {
    page,
    limit,
    sortOrder,
    sortBy,
    search,
  });

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
