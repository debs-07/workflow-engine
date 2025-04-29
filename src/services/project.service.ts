import { SuccessResponse } from "../@types/success-response";
import { IProject, Project } from "../models/core/project.model.ts";
import { CustomError } from "../utils/errors.util.ts";

export const fetchProjectsService = async (userId: string): Promise<SuccessResponse<IProject[]>> => {
  const projects = await Project.find(
    { userId, isDeleted: false },
    { name: 1, description: 1, userId: 1, createdAt: 1, updatedAt: 1 },
  );
  return {
    message: "Projects fetched successfully",
    data: projects,
  };
};

export const createProjectService = async (
  name: string,
  description: string,
  userId: string,
): Promise<SuccessResponse> => {
  const isProjectExist = await Project.findOne({ name, userId, isDeleted: false });

  if (isProjectExist) throw new CustomError(403, `Project with the name ${name} already exists`);

  const project = new Project({ name, description, userId });

  await project.save();

  return {
    message: "Project created successfully",
  };
};

export const fetchProjectDetailsService = async (id: string, userId: string): Promise<SuccessResponse<IProject>> => {
  const project = await Project.findOne(
    { _id: id, userId: userId, isDeleted: false },
    {
      name: 1,
      description: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  );

  if (!project) throw new CustomError(404, `Project with id ${id} not found`);

  return {
    message: "Project details fetched successfully",
    data: project,
  };
};

export const updateProjectDetailsService = async (
  id: string,
  name: string,
  description: string,
  userId: string,
): Promise<SuccessResponse> => {
  const existingProject = await Project.findOne({
    name,
    userId,
    _id: { $ne: id }, // Exclude the current project (identified by id) from the duplicate name check
    isDeleted: false,
  });

  if (existingProject) throw new CustomError(403, `Project with the name ${name} already exists`);

  const project = await Project.findOneAndUpdate(
    { _id: id, userId },
    {
      $set: { name, description },
    },
    { new: true }, // Including it returns the updated project other wise the old project
  );

  if (!project) throw new CustomError(404, "Project not found");

  return {
    message: "Project details updated successfully",
  };
};

export const deleteProjectService = async (id: string, userId: string): Promise<SuccessResponse> => {
  const project = await Project.findOneAndUpdate(
    { _id: id, userId, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date() } },
  );

  if (!project) throw new CustomError(404, "Project deletion unsuccessful");

  return {
    message: "Project deleted successfully",
  };
};
