import z from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(3, "Workspace name is required"),
  description: z.string().optional(),
  color: z.string().min(1, "Color is required"),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Valid email is required"),
  role: z.enum(["member", "admin"], {
    errorMap: () => ({ message: "Role must be either 'member' or 'admin'" }),
  }),
});

export type WorkspaceSchemaType = z.infer<typeof workspaceSchema>;
export type InviteMemberSchemaType = z.infer<typeof inviteMemberSchema>;
