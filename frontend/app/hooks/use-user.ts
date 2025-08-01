import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { fetchData, updateData } from "~/lib/fetch-util";
import type {
  ChangePasswordFormData,
  ProfileFormData,
} from "~/routes/user/profile";

const queryKey: QueryKey = ["user"];

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey,
    queryFn: () => fetchData("/users/profile"),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      updateData("/users/change-password", data),
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileFormData) => updateData("/users/profile", data),
    onSuccess: (data) => {
      // Invalidate user queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
