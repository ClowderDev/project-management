import z from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(3, "Workspace name is required"),
  description: z.string().optional(),
  color: z.string().min(1, "Color is required"),
});

export type WorkspaceSchemaType = z.infer<typeof workspaceSchema>;
