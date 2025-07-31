import z from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().optional(),
  status: z
    .enum(["Planning", "In Progress", "On Hold", "Completed", "Cancelled"])
    .default("Planning"),
  startDate: z.string().datetime().optional().or(z.date().optional()),
  dueDate: z.string().datetime().optional().or(z.date().optional()),
  tags: z.string().optional(),
  members: z
    .array(
      z.object({
        user: z.string(),
        role: z
          .enum(["manager", "contributor", "viewer"])
          .default("contributor"),
      })
    )
    .optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1, "Project title is required").optional(),
  description: z.string().optional(),
  status: z
    .enum(["Planning", "In Progress", "On Hold", "Completed", "Cancelled"])
    .optional(),
  startDate: z.string().datetime().optional().or(z.date().optional()),
  dueDate: z.string().datetime().optional().or(z.date().optional()),
  tags: z.string().optional(),
  members: z
    .array(
      z.object({
        user: z.string(),
        role: z
          .enum(["manager", "contributor", "viewer"])
          .default("contributor"),
      })
    )
    .optional(),
});

export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchemaType = z.infer<typeof updateProjectSchema>;
