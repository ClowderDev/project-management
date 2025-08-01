import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData } from "~/lib/fetch-util";
import type { WorkspaceSchemaType } from "~/lib/schema";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "~/types";

export const useCreateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkspaceSchemaType) => postData("/workspaces", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => fetchData("/workspaces"),
  });
};

export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = (await fetchData(
        `/workspaces/${workspaceId}/projects`
      )) as any;
      return response.data;
    },
    enabled: !!workspaceId,
  });
};

export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "stats"],
    queryFn: async () => {
      const response = (await fetchData(
        `/workspaces/${workspaceId}/stats`
      )) as {
        data: {
          stats: StatsCardProps;
          taskTrendsData: TaskTrendsData[];
          projectStatusData: ProjectStatusData[];
          taskPriorityData: TaskPriorityData[];
          workspaceProductivityData: WorkspaceProductivityData[];
          upcomingTasks: Task[];
          recentProjects: Project[];
        };
      };
      return response.data;
    },
    enabled: !!workspaceId,
  });
};

export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "details"],
    queryFn: async () => {
      const response = (await fetchData(`/workspaces/${workspaceId}`)) as {
        data: any;
      };
      return response.data;
    },
  });
};

export const useInviteMemberMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; role: string; workspaceId: string }) =>
      postData(`/workspaces/${data.workspaceId}/invite-member`, data),
  });
};

export const useAcceptInviteByTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) =>
      postData(`/workspaces/accept-invite-token`, {
        token,
      }),
  });
};

export const useAcceptGenerateInviteMutation = () => {
  return useMutation({
    mutationFn: (workspaceId: string) =>
      postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
  });
};
