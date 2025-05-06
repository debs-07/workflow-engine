import { FilterQuery, ProjectionType, UpdateQuery, QueryOptions } from "mongoose";

import { SuccessResponseWithPagination, SuccessResponse, FetchFilters } from "../@types/custom/index";
import { IProject, Project } from "../models/core/project.model.ts";
import { ITask, Task } from "../models/core/task.model.ts";
import { CustomError } from "../utils/errors.util.ts";
import { applySearchFilters } from "../helpers/query.helper.ts";

type Filter = FilterQuery<IProject>;
type Projection = ProjectionType<IProject>;
type Update = UpdateQuery<IProject>;
type QueryOpts = QueryOptions<IProject>;

type TaskFilter = FilterQuery<ITask>;
type TaskUpdate = UpdateQuery<ITask>;

export const fetchProjectsService = async (
  userId: string,
  fetchFilters: FetchFilters,
): Promise<SuccessResponseWithPagination<IProject[]>> => {
  const { page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt", search = {} } = fetchFilters;

  const filterQuery: Filter = { userId, isDeleted: false };
  applySearchFilters<ITask>(filterQuery, search, "project");

  const projection: Projection = { _id: 1, name: 1, description: 1, createdAt: 1, updatedAt: 1 };

  const sort = { [sortBy]: sortOrder };
  const skip = (page - 1) * limit;

  const [projects, totalProjects] = await Promise.all([
    Project.find(filterQuery, projection).sort(sort).skip(skip).limit(limit),
    Project.countDocuments(filterQuery),
  ]);

  const totalPages = totalProjects === 0 ? 1 : Math.ceil(totalProjects / limit);

  return {
    message: "Projects fetched successfully",
    data: projects,
    totalData: totalProjects,
    totalPages: totalPages,
  };
};

export const createProjectService = async (project: IProject): Promise<SuccessResponse> => {
  const filterQuery: Filter = { name: project.name, userId: project.userId, isDeleted: false };

  const isProjectExist = await Project.findOne(filterQuery);

  if (isProjectExist) throw new CustomError(403, `Project with the name ${project.name} already exists`);

  const newProject = new Project(project);

  await newProject.save();

  return { message: "Project created successfully" };
};

export const fetchProjectDetailsService = async (id: string, userId: string): Promise<SuccessResponse<IProject>> => {
  const filterQuery: Filter = { _id: id, userId: userId, isDeleted: false };
  const projection: Projection = { _id: 1, name: 1, description: 1, createdAt: 1, updatedAt: 1 };

  const project = await Project.findOne(filterQuery, projection);

  if (!project) throw new CustomError(404, `Project with id ${id} not found`);

  return { message: "Project details fetched successfully", data: project };
};

export const updateProjectDetailsService = async (id: string, project: IProject): Promise<SuccessResponse> => {
  const findOneFilter: Filter = { name: project.name, userId: project.userId, _id: { $ne: id }, isDeleted: false };
  // _id: { $ne: id } to Exclude the current project (identified by id) from the duplicate name check

  const existingProject = await Project.findOne(findOneFilter);

  if (existingProject) throw new CustomError(403, `Project with the name ${project.name} already exists`);

  const findOneAndUpdateFilter: Filter = { _id: id, userId: project.userId };
  const updateQuery: Update = { $set: project };
  const queryOptions: QueryOpts = { new: true }; // Including { new: true } returns the updated project other wise the old project

  const updatedProject = await Project.findOneAndUpdate(findOneAndUpdateFilter, updateQuery, queryOptions);

  if (!updatedProject) throw new CustomError(404, "Project not found");

  return { message: "Project details updated successfully" };
};

export const deleteProjectService = async (id: string, userId: string): Promise<SuccessResponse> => {
  const projectFilterQuery: Filter = { _id: id, userId, isDeleted: false };
  const projectUpdateQuery: Update = { $set: { isDeleted: true, deletedAt: new Date() } };

  const project = await Project.findOneAndUpdate(projectFilterQuery, projectUpdateQuery);

  if (!project) throw new CustomError(404, "Project deletion unsuccessful");

  const taskFilterQuery: TaskFilter = { projectId: id, userId: userId };
  const taskUpdateQuery: TaskUpdate = { $set: { projectId: null } };

  await Task.updateMany(taskFilterQuery, taskUpdateQuery);

  return { message: "Project deleted successfully" };
};
