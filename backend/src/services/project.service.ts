import mongoose, { Types } from "mongoose";
import ProjectModel from "../models/project.model";
import WorkspaceModel from "../models/workspace.model";
import { BadRequestException } from "../utils/app-error";
import {
  CreateProjectSchemaType,
  UpdateProjectSchemaType,
} from "../validation/project.validator";
import TaskModel from "../models/task.model";

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

      // Ensure the project creator is always included as a member with manager role
      const members = projectData.members || [];
      const creatorAlreadyMember = members.some(
        (member) => member.user === userId
      );

      if (!creatorAlreadyMember) {
        members.push({
          user: userId,
          role: "manager",
        });
      }

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
            members: members,
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
    .populate("members.user", "name email profilePicture")
    .populate("createdBy", "name email profilePicture");

  if (!project) {
    throw new BadRequestException("Project not found");
  }

  // Check if user is the creator or a member
  const isCreator = project.createdBy?._id?.toString() === userId;
  const isMember = project.members.some(
    (member) => member.user._id?.toString() === userId
  );

  if (!isCreator && !isMember) {
    console.log("Access denied - User ID:", userId);
    console.log("Project Creator ID:", project.createdBy?._id?.toString());
    console.log(
      "Project Member IDs:",
      project.members.map((m) => m.user._id?.toString())
    );
    console.log("Debug: isCreator =", isCreator, "isMember =", isMember);
    throw new BadRequestException("You don't have access to this project");
  }

  return project;
};

export const getProjectTaskService = async (
  projectId: string,
  userId: string
) => {
  const project = await ProjectModel.findById(projectId)
    .populate("members.user", "_id")
    .populate("createdBy", "_id");

  if (!project) {
    throw new BadRequestException("Project not found");
  }

  // Check if user is the creator or a member
  const isCreator = project.createdBy?._id?.toString() === userId;
  const isMember = project.members.some(
    (member) => member.user._id?.toString() === userId
  );

  if (!isCreator && !isMember) {
    throw new BadRequestException("You don't have access to this project");
  }

  const tasks = await TaskModel.find({ project: projectId, isArchived: false })
    .populate("assignees", "name profilePicture")
    .sort({ createdAt: -1 });

  return tasks;
};
