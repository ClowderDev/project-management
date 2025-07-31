import mongoose, { Types } from "mongoose";
import ProjectModel from "../models/project.model";
import WorkspaceModel from "../models/workspace.model";
import { BadRequestException } from "../utils/app-error";
import {
  CreateProjectSchemaType,
  UpdateProjectSchemaType,
} from "../validation/project.validator";

export const createProjectService = async (
  workspaceId: string,
  projectData: CreateProjectSchemaType,
  userId: string
) => {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      // Find workspace
      const workspace =
        await WorkspaceModel.findById(workspaceId).session(session);

      if (!workspace) {
        throw new BadRequestException("Workspace not found");
      }

      // Check if user is a member of the workspace
      const isMember = workspace.members.some(
        (member) => member.user.toString() === userId
      );

      if (!isMember) {
        throw new BadRequestException("You are not a member of this workspace");
      }

      // Process tags
      const tagArray = projectData.tags ? projectData.tags.split(",") : [];

      // Process dates
      const startDate = projectData.startDate
        ? new Date(projectData.startDate)
        : undefined;
      const dueDate = projectData.dueDate
        ? new Date(projectData.dueDate)
        : undefined;

      // Create project
      const newProject = await ProjectModel.create(
        [
          {
            title: projectData.title,
            description: projectData.description,
            status: projectData.status,
            startDate,
            dueDate,
            tags: tagArray,
            workspace: workspaceId,
            members: projectData.members || [],
            createdBy: userId,
          },
        ],
        { session }
      );

      // Add project to workspace
      const projectId =
        typeof newProject[0]._id === "string"
          ? new Types.ObjectId(newProject[0]._id)
          : (newProject[0]._id as Types.ObjectId);

      workspace.projects.push(projectId);
      await workspace.save({ session });

      return newProject[0];
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getProjectByIdService = async (
  projectId: string,
  userId: string
) => {
  const project = await ProjectModel.findById(projectId)
    .populate("workspace", "name description")
    .populate("tasks")
    .populate("members.user", "name email profilePicture")
    .populate("createdBy", "name email profilePicture");

  if (!project) {
    throw new BadRequestException("Project not found");
  }

  // Check if user has access to this project (is a member of the workspace)
  const workspace = await WorkspaceModel.findById(project.workspace);
  if (!workspace) {
    throw new BadRequestException("Workspace not found");
  }

  const isMember = workspace.members.some(
    (member) => member.user.toString() === userId
  );

  if (!isMember) {
    throw new BadRequestException("You don't have access to this project");
  }

  return project;
};

export const updateProjectService = async (
  projectId: string,
  updateData: UpdateProjectSchemaType,
  userId: string
) => {
  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new BadRequestException("Project not found");
  }

  // Check if user has access to this project
  const workspace = await WorkspaceModel.findById(project.workspace);
  if (!workspace) {
    throw new BadRequestException("Workspace not found");
  }

  const isMember = workspace.members.some(
    (member) => member.user.toString() === userId
  );

  if (!isMember) {
    throw new BadRequestException("You don't have access to this project");
  }

  // Process update data
  const updateFields: any = {};

  if (updateData.title) updateFields.title = updateData.title;
  if (updateData.description !== undefined)
    updateFields.description = updateData.description;
  if (updateData.status) updateFields.status = updateData.status;
  if (updateData.startDate)
    updateFields.startDate = new Date(updateData.startDate);
  if (updateData.dueDate) updateFields.dueDate = new Date(updateData.dueDate);
  if (updateData.tags) updateFields.tags = updateData.tags.split(",");
  if (updateData.members) updateFields.members = updateData.members;

  const updatedProject = await ProjectModel.findByIdAndUpdate(
    projectId,
    updateFields,
    { new: true, runValidators: true }
  )
    .populate("workspace", "name description")
    .populate("tasks")
    .populate("members.user", "name email profilePicture")
    .populate("createdBy", "name email profilePicture");

  return updatedProject;
};

export const deleteProjectService = async (
  projectId: string,
  userId: string
) => {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      const project = await ProjectModel.findById(projectId).session(session);

      if (!project) {
        throw new BadRequestException("Project not found");
      }

      // Check if user has access to this project
      const workspace = await WorkspaceModel.findById(
        project.workspace
      ).session(session);
      if (!workspace) {
        throw new BadRequestException("Workspace not found");
      }

      const isMember = workspace.members.some(
        (member) => member.user.toString() === userId
      );

      if (!isMember) {
        throw new BadRequestException("You don't have access to this project");
      }

      // Remove project from workspace
      workspace.projects = workspace.projects.filter(
        (id) => id.toString() !== projectId
      );
      await workspace.save({ session });

      // Delete the project
      await ProjectModel.findByIdAndDelete(projectId).session(session);

      return { message: "Project deleted successfully" };
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};
