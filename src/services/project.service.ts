import { SuccessResponse } from "../@types/success-response";
import { IProject, Project } from "../models/core/project.model.ts";
import { CustomError } from "../utils/errors.util.ts";

export const fetchProjectsService = async (userId: string): Promise<SuccessResponse<IProject[]>> => {
  const filter = { userId, isDeleted: false };
  const projection = { _id: 1, name: 1, description: 1, userId: 1, createdAt: 1, updatedAt: 1 };

  const projects = await Project.find(filter, projection);

  return { message: "Projects fetched successfully", data: projects };
};

export const createProjectService = async (project: IProject): Promise<SuccessResponse> => {
  const isProjectExist = await Project.findOne({ name: project.name, userId: project.userId, isDeleted: false });

  if (isProjectExist) throw new CustomError(403, `Project with the name ${name} already exists`);

  const newProject = new Project(project);

  await newProject.save();

  return { message: "Project created successfully" };
};

export const fetchProjectDetailsService = async (id: string, userId: string): Promise<SuccessResponse<IProject>> => {
  const filter = { _id: id, userId: userId, isDeleted: false };
  const projection = { _id: 1, name: 1, description: 1, createdAt: 1, updatedAt: 1 };

  const project = await Project.findOne(filter, projection);

  if (!project) throw new CustomError(404, `Project with id ${id} not found`);

  return { message: "Project details fetched successfully", data: project };
};

export const updateProjectDetailsService = async (id: string, project: IProject): Promise<SuccessResponse> => {
  const findOneFilter = { name: project.name, userId: project.userId, _id: { $ne: id }, isDeleted: false };
  // _id: { $ne: id } to Exclude the current project (identified by id) from the duplicate name check

  const existingProject = await Project.findOne(findOneFilter);

  if (existingProject) throw new CustomError(403, `Project with the name ${project?.name} already exists`);

  const findOneAndUpdateFilter = { _id: id, userId: project.userId };
  const updateOperator = { $set: { name: project.name, description: project.description } };
  const optionsObject = { new: true }; // Including { new: true } returns the updated project other wise the old project

  const updatedProject = await Project.findOneAndUpdate(findOneAndUpdateFilter, updateOperator, optionsObject);

  if (!updatedProject) throw new CustomError(404, "Project not found");

  return { message: "Project details updated successfully" };
};

export const deleteProjectService = async (id: string, userId: string): Promise<SuccessResponse> => {
  const filter = { _id: id, userId, isDeleted: false };
  const updateOperator = { $set: { isDeleted: true, deletedAt: new Date() } };

  const project = await Project.findOneAndUpdate(filter, updateOperator);

  if (!project) throw new CustomError(404, "Project deletion unsuccessful");

  return { message: "Project deleted successfully" };
};
