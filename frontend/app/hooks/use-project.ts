import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData } from "~/lib/fetch-util";
import type { ProjectSchemaType } from "~/lib/schema";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectData: ProjectSchemaType;
      workspaceId: string;
    }) =>
      postData(
        `/projects/${data.workspaceId}/create-project`,
        data.projectData
      ),
    onSuccess: (data: any, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId],
      });
    },
  });
};

export const useProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchData(`/projects/${projectId}/tasks`),
  });
};
