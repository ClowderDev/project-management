import ProjectModel from "../models/project.model";
import WorkspaceModel from "../models/workspace.model";
import { taskSchemaType } from "../models/task.model";
import { ProjectDocument } from "../models/project.model";
import { Types } from "mongoose";

// Extended task type with timestamps
interface ExtendedTaskType extends taskSchemaType {
  createdAt: Date;
  updatedAt: Date;
}

// Type for project with populated tasks
interface ProjectWithTasks extends Omit<ProjectDocument, "tasks"> {
  tasks: ExtendedTaskType[];
}

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
    .populate("tasks") // Populate all fields of tasks to access status and others
    .populate("createdBy", "name email profilePicture")
    .populate("members.user", "name email profilePicture");

  return projects;
};

export const getWorkspaceStatsService = async (
  workspaceId: string,
  userId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const isMember = workspace.members.some(
    (member) => member.user.toString() === userId
  );

  if (!isMember) {
    throw new Error("User is not a member of this workspace");
  }

  const [totalProjects, projects] = await Promise.all([
    ProjectModel.countDocuments({ workspace: workspaceId }),
    ProjectModel.find({ workspace: workspaceId })
      .populate({
        path: "tasks",
        select: "title status dueDate project updatedAt isArchived priority",
      })
      .sort({ createdAt: -1 }),
  ]);

  // Type assertion for populated projects
  const populatedProjects = projects as unknown as ProjectWithTasks[];

  const totalTasks = populatedProjects.reduce((acc, project) => {
    return acc + project.tasks.length;
  }, 0);

  const totalProjectInProgress = populatedProjects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const totalTaskCompleted = populatedProjects.reduce((acc, project) => {
    return acc + project.tasks.filter((task) => task.status === "Done").length;
  }, 0);

  const totalTaskToDo = populatedProjects.reduce((acc, project) => {
    return acc + project.tasks.filter((task) => task.status === "To Do").length;
  }, 0);

  const totalTaskInProgress = populatedProjects.reduce((acc, project) => {
    return (
      acc + project.tasks.filter((task) => task.status === "In Progress").length
    );
  }, 0);

  const tasks = populatedProjects.flatMap((project) => project.tasks);

  const upcomingTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return (
      taskDate > today &&
      taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    );
  });

  const taskTrendsData = [
    { name: "Sun", completed: 0, inProgress: 0, toDo: 0 },
    { name: "Mon", completed: 0, inProgress: 0, toDo: 0 },
    { name: "Tue", completed: 0, inProgress: 0, toDo: 0 },
    { name: "Wed", completed: 0, inProgress: 0, toDo: 0 },
    { name: "Thu", completed: 0, inProgress: 0, toDo: 0 },
    { name: "Fri", completed: 0, inProgress: 0, toDo: 0 },
    { name: "Sat", completed: 0, inProgress: 0, toDo: 0 },
  ];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  for (const project of populatedProjects) {
    for (const task of project.tasks) {
      const taskDate = new Date(task.updatedAt);

      const dayInDate = last7Days.findIndex(
        (date) =>
          date.getDate() === taskDate.getDate() &&
          date.getMonth() === taskDate.getMonth() &&
          date.getFullYear() === taskDate.getFullYear()
      );

      if (dayInDate !== -1) {
        const dayName = last7Days[dayInDate].toLocaleDateString("en-US", {
          weekday: "short",
        });

        const dayData = taskTrendsData.find((day) => day.name === dayName);

        if (dayData) {
          switch (task.status) {
            case "Done":
              dayData.completed++;
              break;
            case "In Progress":
              dayData.inProgress++;
              break;
            case "To Do":
              dayData.toDo++;
              break;
          }
        }
      }
    }
  }

  const projectStatusData = [
    { name: "Completed", value: 0, color: "#10b981" },
    { name: "In Progress", value: 0, color: "#3b82f6" },
    { name: "Planning", value: 0, color: "#f59e0b" },
  ];

  for (const project of projects) {
    switch (project.status) {
      case "Completed":
        projectStatusData[0].value++;
        break;
      case "In Progress":
        projectStatusData[1].value++;
        break;
      case "Planning":
        projectStatusData[2].value++;
        break;
    }
  }

  const taskPriorityData = [
    { name: "High", value: 0, color: "#ef4444" },
    { name: "Medium", value: 0, color: "#f59e0b" },
    { name: "Low", value: 0, color: "#6b7280" },
  ];

  for (const task of tasks) {
    switch (task.priority) {
      case "High":
        taskPriorityData[0].value++;
        break;
      case "Medium":
        taskPriorityData[1].value++;
        break;
      case "Low":
        taskPriorityData[2].value++;
        break;
    }
  }

  const workspaceProductivityData = [];

  for (const project of populatedProjects) {
    const projectTask = tasks.filter(
      (task) =>
        task.project.toString() === (project._id as Types.ObjectId).toString()
    );

    const completedTask = projectTask.filter(
      (task) => task.status === "Done" && task.isArchived === false
    );

    workspaceProductivityData.push({
      name: project.title,
      completed: completedTask.length,
      total: projectTask.length,
    });
  }

  const stats = {
    totalProjects,
    totalTasks,
    totalProjectInProgress,
    totalTaskCompleted,
    totalTaskToDo,
    totalTaskInProgress,
  };

  return {
    stats,
    taskTrendsData,
    projectStatusData,
    taskPriorityData,
    workspaceProductivityData,
    upcomingTasks,
    recentProjects: populatedProjects.slice(0, 5),
  };
};
