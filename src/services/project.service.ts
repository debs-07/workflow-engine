import { FilterQuery, ProjectionType, UpdateQuery, QueryOptions } from "mongoose";

import { SuccessResponse } from "../@types/success-response";
import { IProject, Project } from "../models/core/project.model.ts";
import { CustomError } from "../utils/errors.util.ts";

type Filter = FilterQuery<IProject>;
type Projection = ProjectionType<IProject>;
type Update = UpdateQuery<IProject>;
type QueryOpts = QueryOptions<IProject>;

export const fetchProjectsService = async (userId: string): Promise<SuccessResponse<IProject[]>> => {
  const filterQuery: Filter = { userId, isDeleted: false };
  const projection: Projection = { _id: 1, name: 1, description: 1, userId: 1, createdAt: 1, updatedAt: 1 };

  const projects = await Project.find(filterQuery, projection);

  return { message: "Projects fetched successfully", data: projects };
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

  if (existingProject) throw new CustomError(403, `Project with the name ${project?.name} already exists`);

  const findOneAndUpdateFilter: Filter = { _id: id, userId: project.userId };
  const updateQuery: Update = { $set: project };
  const queryOptions: QueryOpts = { new: true }; // Including { new: true } returns the updated project other wise the old project

  const updatedProject = await Project.findOneAndUpdate(findOneAndUpdateFilter, updateQuery, queryOptions);

  if (!updatedProject) throw new CustomError(404, "Project not found");

  return { message: "Project details updated successfully" };
};

export const deleteProjectService = async (id: string, userId: string): Promise<SuccessResponse> => {
  const filterQuery: Filter = { _id: id, userId, isDeleted: false };
  const updateQuery: Update = { $set: { isDeleted: true, deletedAt: new Date() } };

  const project = await Project.findOneAndUpdate(filterQuery, updateQuery);

  if (!project) throw new CustomError(404, "Project deletion unsuccessful");

  return { message: "Project deleted successfully" };
};
