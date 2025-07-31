import ProjectModel from "../models/project.model";
import WorkspaceModel from "../models/workspace.model";

export const createWorkspaceService = async (
  name: string,
  description: string | undefined,
  color: string,
  userId: string
) => {
  const workspace = await WorkspaceModel.create({
    name,
    description,
    color,
    owner: userId,
    members: [
      {
        user: userId,
        role: "owner",
        joinedAt: new Date(),
      },
    ],
  });

  return workspace;
};

export const getAllWorkspacesService = async (userId: string) => {
  const workspaces = await WorkspaceModel.find({ "members.user": userId })
    .populate("members.user", "name email")
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  return workspaces;
};

export const getWorkspaceByIdService = async (workspaceId: string) => {
  const workspace = await WorkspaceModel.findOne({
    _id: workspaceId,
  })
    .populate("members.user", "name email profilePicture")
    .populate("owner", "name email profilePicture");

  return workspace;
};

export const getWorkspaceProjectsService = async (workspaceId: string) => {
  const projects = await ProjectModel.find({
    workspace: workspaceId,
    isArchived: false,
  })
    .populate("tasks", "status")
    .populate("createdBy", "name email profilePicture")
    .populate("members.user", "name email profilePicture");

  return projects;
};
