import { FilterQuery, ProjectionType, UpdateQuery, QueryOptions } from "mongoose";

import { SuccessResponse } from "../@types/success-response";
import { ITask, Task } from "../models/core/task.model.ts";
import { IProject, Project } from "../models/core/project.model.ts";
import { CustomError } from "../utils/errors.util.ts";

type Filter = FilterQuery<ITask>;
type Projection = ProjectionType<ITask>;
type Update = UpdateQuery<ITask>;
type QueryOpts = QueryOptions<ITask>;

type ProjectFilter = FilterQuery<IProject>;

export const fetchTasksService = async (userId: string): Promise<SuccessResponse<ITask[]>> => {
  const filterQuery: Filter = { userId: userId, isDeleted: false };
  const projection: Projection = {
    title: 1,
    description: 1,
    status: 1,
    priority: 1,
    dueDate: 1,
    userId: 1,
    projectId: 1,
    createdAt: 1,
    updatedAt: 1,
  };
  const tasks = await Task.find(filterQuery, projection);

  return { message: "Tasks fetched successfully", data: tasks };
};

export const createTaskService = async (task: ITask): Promise<SuccessResponse> => {
  if (task.projectId) {
    const projectFilterQuery: ProjectFilter = { _id: task.projectId, userId: task.userId };
    const project = await Project.findOne(projectFilterQuery);

    if (!project) throw new CustomError(404, `Project with id ${task.projectId} not found`);
  }

  const newTask = new Task(task);

  await newTask.save();

  return { message: "Task created successfully" };
};

export const fetchTaskDetailsService = async (id: string, userId: string): Promise<SuccessResponse<ITask>> => {
  const filterQuery: Filter = { _id: id, userId: userId, isDeleted: false };
  const projection: Projection = {
    title: 1,
    description: 1,
    status: 1,
    priority: 1,
    dueDate: 1,
    userId: 1,
    projectId: 1,
    createdAt: 1,
    updatedAt: 1,
  };

  const task = await Task.findOne(filterQuery, projection);

  if (!task) throw new CustomError(404, `Task with id ${id} not found`);

  return { message: "Task details fetched successfully", data: task };
};

export const updateTaskDetailsService = async (id: string, task: ITask): Promise<SuccessResponse> => {
  if (task.projectId) {
    const projectFilterQuery: ProjectFilter = { _id: task.projectId, userId: task.userId };
    const project = await Project.findOne(projectFilterQuery);

    if (!project) throw new CustomError(404, `Project with id ${task.projectId} not found`);
  }

  const filterQuery: Filter = { _id: id, userId: task.userId };
  const updateQuery: Update = { $set: task };
  const queryOptions: QueryOpts = { new: true }; // Including it returns the updated task other wise the old task

  const newTask = await Task.findOneAndUpdate(filterQuery, updateQuery, queryOptions);

  if (!newTask) throw new CustomError(404, "Task not found");

  return { message: "Task details updated successfully" };
};

export const deleteTaskService = async (id: string, userId: string): Promise<SuccessResponse> => {
  const filterQuery: Filter = { _id: id, userId, isDeleted: false };
  const updateQuery: Update = { $set: { isDeleted: true, deletedAt: new Date() } };

  const task = await Task.findOneAndUpdate(filterQuery, updateQuery);

  if (!task) throw new CustomError(404, "Task deletion unsuccessful");

  return { message: "Task deleted successfully" };
};
