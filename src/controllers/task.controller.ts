import { NextFunction, Request, Response } from "express";

import { createResponse } from "../helpers/response.helper.ts";
import {
  createTaskService,
  deleteTaskService,
  fetchTaskDetailsService,
  fetchTasksService,
  updateTaskDetailsService,
} from "../services/task.service.ts";
import { ITask } from "../models/core/task.model.ts";

export const fetchTasks = async (req: Request, res: Response, _next: NextFunction) => {
  const { message, data } = await fetchTasksService(req.userId);

  res.status(200).json(createResponse({ message, data }));
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
