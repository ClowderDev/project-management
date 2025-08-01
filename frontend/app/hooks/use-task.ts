import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData, postData, updateData } from "~/lib/fetch-util";
import type { CreateTaskSchemaType } from "~/lib/schema";
import type { TaskPriority, TaskStatus } from "~/types";

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { projectId: string; taskData: CreateTaskSchemaType }) =>
      postData(`/tasks/${data.projectId}/create-task`, data.taskData),
    onSuccess: (data: any, variables: any) => {
      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};

export const useTaskByIdQuery = (taskId: string) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchData(`/tasks/${taskId}`),
    enabled: !!taskId, // Only run if taskId is defined
  });
};

export const useUpdateTaskTitleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; title: string }) =>
      updateData(`/tasks/${data.taskId}/title`, { title: data.title }),
    onSuccess: (data: any, variables) => {
      // Use the taskId from the mutation variables
      const taskId = variables.taskId;

      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};

export const useUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; status: TaskStatus }) =>
      updateData(`/tasks/${data.taskId}/status`, { status: data.status }),
    onSuccess: (data: any, variables) => {
      // Use the taskId from the mutation variables
      const taskId = variables.taskId;

      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};

export const useUpdateTaskDescriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; description: string }) =>
      updateData(`/tasks/${data.taskId}/description`, {
        description: data.description,
      }),
    onSuccess: (data: any, variables) => {
      // Use the taskId from the mutation variables
      const taskId = variables.taskId;

      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};

export const useUpdateTaskAssigneesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; assignees: string[] }) =>
      updateData(`/tasks/${data.taskId}/assignees`, {
        assignees: data.assignees,
      }),
    onSuccess: (data: any, variables) => {
      // Use the taskId from the mutation variables
      const taskId = variables.taskId;

      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};

export const useUpdateTaskPriorityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; priority: TaskPriority }) =>
      updateData(`/tasks/${data.taskId}/priority`, { priority: data.priority }),
    onSuccess: (data: any, variables) => {
      // Use the taskId from the mutation variables
      const taskId = variables.taskId;

      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};

export const useAddSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; title: string }) =>
      postData(`/tasks/${data.taskId}/add-subtask`, { title: data.title }),
    onSuccess: (data: any, variables) => {
      // Use the taskId from the mutation variables
      const taskId = variables.taskId;

      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};

export const useUpdateSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      taskId: string;
      subTaskId: string;
      completed: boolean;
    }) =>
      updateData(`/tasks/${data.taskId}/update-subtask/${data.subTaskId}`, {
        completed: data.completed,
      }),
    onSuccess: (data: any, variables) => {
      // Use the taskId from the mutation variables
      const taskId = variables.taskId;

      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; text: string }) =>
      postData(`/tasks/${data.taskId}/add-comment`, { text: data.text }),
    onSuccess: (data: any, variables) => {
      // Use the taskId from the mutation variables instead of data.task
      const taskId = variables.taskId;

      queryClient.invalidateQueries({
        queryKey: ["comments", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};

export const useGetCommentsByTaskIdQuery = (taskId: string) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => fetchData(`/tasks/${taskId}/comments`),
  });
};

export const useWatchTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string }) =>
      postData(`/tasks/${data.taskId}/watch`, {}),
    onSuccess: (data: any, variables) => {
      // Use the taskId from the mutation variables
      const taskId = variables.taskId;

      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};

export const useAchievedTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string }) =>
      postData(`/tasks/${data.taskId}/achieved`, {}),
    onSuccess: (data: any, variables) => {
      // Use the taskId from the mutation variables
      const taskId = variables.taskId;

      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};

export const useGetMyTasksQuery = () => {
  return useQuery({
    queryKey: ["my-tasks", "user"],
    queryFn: async () => {
      const response = await fetchData<{ tasks: any[] }>("/tasks/my-tasks");
      return response.tasks;
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteData(`/tasks/${taskId}`),
    onSuccess: (data: any, variables) => {
      // Use the taskId from the mutation variables
      const taskId = variables;

      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-tasks"],
      });

      // Force refetch all queries
      queryClient.refetchQueries();
    },
  });
};
