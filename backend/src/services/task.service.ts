import mongoose, { Model, Types } from "mongoose";
import { CreateTaskSchemaType } from "../validation/task.validator";
import ProjectModel from "../models/project.model";
import WorkspaceModel from "../models/workspace.model";
import TaskModel from "../models/task.model";
import { recordActivity } from "../utils/lib";
import ActivityModel from "../models/activity.model";
import CommentModel from "../models/comment.model";

export const createTaskService = async (
  projectId: string,
  taskData: CreateTaskSchemaType,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const project = await ProjectModel.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    const workspace = await WorkspaceModel.findById(project.workspace);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (!isMember) {
      throw new Error("User is not a member of the workspace");
    }

    const [newTask] = await TaskModel.create(
      [{ ...taskData, project: projectId, createdBy: userId }],
      {
        session,
      }
    );

    await ProjectModel.findByIdAndUpdate(
      projectId,
      { $push: { tasks: newTask._id } },
      { session }
    );

    await recordActivity(userId, "created_task", "Task", String(newTask._id), {
      description: `created task "${taskData.title}"`,
    });

    await session.commitTransaction();

    return newTask;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getTaskByIdService = async (taskId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const task = await TaskModel.findById(taskId)
      .populate("assignees", "name profilePicture")
      .populate("watchers", "name profilePicture");

    if (!task) {
      return null;
    }

    const project = await ProjectModel.findById(task.project).populate(
      "members.user",
      "name profilePicture"
    );

    return { task, project };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateTaskTitleService = async (
  taskId: string,
  title: string,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await TaskModel.findById(taskId).session(session);

    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ProjectModel.findById(task.project).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      throw new Error("User is not a member of the project");
    }

    const oldTitle = task.title;
    if (oldTitle === title) {
      return task; // No change needed
    }

    task.title = title;
    await task.save({ session });

    await recordActivity(userId, "updated_task", "Task", taskId, {
      description: `updated task title from "${oldTitle}" to "${title}"`,
    });

    await session.commitTransaction();

    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateTaskDescriptionService = async (
  taskId: string,
  description: string,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await TaskModel.findById(taskId).session(session);

    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ProjectModel.findById(task.project).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      throw new Error("User is not a member of the project");
    }

    const oldDescription =
      task.description?.substring(0, 50) +
      (task.description && task.description.length > 50 ? "..." : "");
    const newDescription =
      description.substring(0, 50) + (description.length > 50 ? "..." : "");
    if (oldDescription === newDescription) {
      return task; // No change needed
    }

    task.description = description;
    await task.save({ session });

    await recordActivity(userId, "updated_task", "Task", taskId, {
      description: `updated task description`,
    });

    await session.commitTransaction();

    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateTaskStatusService = async (
  taskId: string,
  status: string,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const task = await TaskModel.findById(taskId).session(session);
    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ProjectModel.findById(task.project).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      throw new Error("User is not a member of the project");
    }

    const oldStatus = task.status;
    if (oldStatus === status) {
      return task; // No change needed
    }

    const allowedStatuses = ["To Do", "In Progress", "Review", "Done"] as const;
    if (!allowedStatuses.includes(status as any)) {
      throw new Error("Invalid status value");
    }
    task.status = status as (typeof allowedStatuses)[number];
    await task.save({ session });

    // Record appropriate activity based on the status change
    if (status === "Done" && oldStatus !== "Done") {
      await recordActivity(userId, "completed_task", "Task", taskId, {
        description: `completed task`,
      });
    } else {
      await recordActivity(userId, "updated_task", "Task", taskId, {
        description: `updated task status from ${oldStatus} to ${status}`,
      });
    }

    await session.commitTransaction();

    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateTaskAssigneesService = async (
  taskId: string,
  assignees: Types.ObjectId[],
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await TaskModel.findById(taskId).session(session);

    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ProjectModel.findById(task.project).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      throw new Error("User is not a member of the project");
    }

    const oldAssignees = task.assignees;

    task.assignees = assignees;
    await task.save();

    await recordActivity(userId, "updated_task", "Task", taskId, {
      description: `updated task assignees`,
    });

    await session.commitTransaction();

    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateTaskPriority = async (
  taskId: string,
  priority: string,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await TaskModel.findById(taskId).session(session);

    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ProjectModel.findById(task.project).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      throw new Error("User is not a member of the project");
    }

    const oldPriority = task.priority;

    if (!["Low", "Medium", "High"].includes(priority)) {
      throw new Error("Invalid priority value");
    }
    task.priority = priority as "Low" | "Medium" | "High";
    await task.save();

    await recordActivity(userId, "updated_task", "Task", taskId, {
      description: `updated task priority to ${priority}`,
    });

    await session.commitTransaction();

    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const addSubTaskService = async (
  taskId: string,
  title: string,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await TaskModel.findById(taskId).session(session);

    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ProjectModel.findById(task.project).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      throw new Error("User is not a member of the project");
    }

    const newSubTask = {
      title,
      completed: false,
      createdAt: new Date(),
    };

    task.subtasks.push(newSubTask);
    await task.save();

    await recordActivity(userId, "created_subtask", "Task", taskId, {
      description: `created subtask "${title}"`,
    });

    await session.commitTransaction();

    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateSubTaskService = async (
  taskId: string,
  subTaskId: string,
  completed: boolean,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await TaskModel.findById(taskId).session(session);

    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ProjectModel.findById(task.project).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      throw new Error("User is not a member of the project");
    }

    const subTask = task.subtasks.find(
      (subTask: any) => subTask._id?.toString() === subTaskId
    );
    if (!subTask) {
      throw new Error("Subtask not found");
    }

    subTask.completed = completed;
    await task.save();
    await recordActivity(userId, "updated_subtask", "Task", taskId, {
      description: `${completed ? "completed" : "reopened"} subtask "${subTask.title}"`,
    });

    await session.commitTransaction();

    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getActivityByResourceIdService = async (resourceId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const activities = await ActivityModel.find({ resourceId })
      .populate("user", "name profilePicture")
      .session(session);

    if (!activities) {
      throw new Error("No activities found for this resource");
    }

    await session.commitTransaction();
    return activities;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getCommentByTaskIdService = async (taskId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const comment = await CommentModel.find({ task: taskId })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 })
      .session(session);

    await session.commitTransaction();
    return comment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const addCommentService = async (
  taskId: string,
  text: string,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await TaskModel.findById(taskId).session(session);

    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ProjectModel.findById(task.project).session(session);

    if (!project) {
      throw new Error("Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isMember) {
      throw new Error("User is not a member of the project");
    }

    const newComment = await CommentModel.create(
      [
        {
          text,
          task: taskId,
          author: userId,
        },
      ],
      { session }
    );

    await newComment[0].populate("author", "name profilePicture");

    const commentId =
      typeof newComment[0]._id === "string"
        ? new Types.ObjectId(newComment[0]._id)
        : (newComment[0]._id as Types.ObjectId);
    task.comments.push(commentId);
    await task.save({ session });

    await recordActivity(userId, "added_comment", "Task", taskId, {
      description: `added a comment`,
    });

    await session.commitTransaction();
    return newComment[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const watchTaskService = async (taskId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await TaskModel.findById(taskId).session(session);

    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ProjectModel.findById(task.project).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (!isMember) {
      throw new Error("User is not a member of the project");
    }

    const isWatching = task.watchers.includes(new Types.ObjectId(userId));

    if (!isWatching) {
      task.watchers.push(new Types.ObjectId(userId));
    } else {
      task.watchers = task.watchers.filter(
        (watcher) => watcher.toString() !== userId.toString()
      );
    }

    await task.save({ session });

    // Note: Watching/unwatching doesn't create activity logs as it's not in the supported ActionType enum

    await session.commitTransaction();
    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const archivedTaskService = async (taskId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await TaskModel.findById(taskId).session(session);

    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ProjectModel.findById(task.project).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (!isMember) {
      throw new Error("User is not a member of the project");
    }

    const isAchieved = task.isArchived;

    task.isArchived = !isAchieved;
    await task.save();

    // Note: Archiving/unarchiving doesn't create activity logs as it's not in the supported ActionType enum

    await session.commitTransaction();
    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getMyTaskService = async (userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const tasks = await TaskModel.find({ assignees: userId })
      .populate("project", "title workspace")
      .session(session);

    if (!tasks || tasks.length === 0) {
      throw new Error("No tasks found for this user");
    }

    await session.commitTransaction();
    return tasks;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const deleteTaskService = async (taskId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await TaskModel.findById(taskId).session(session);

    if (!task) {
      throw new Error("Task not found");
    }

    const project = await ProjectModel.findById(task.project).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (!isMember) {
      throw new Error("User is not a member of the project");
    }

    await TaskModel.deleteOne({ _id: taskId }, { session });

    // Note: Deleting tasks doesn't create activity logs as it's not in the supported ActionType enum

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
