import mongoose, { Schema, Document, Types } from "mongoose";

export interface ProjectDocument extends Document {
  title: string;
  description?: string;
  workspace: Types.ObjectId;
  status: "Planning" | "In Progress" | "On Hold" | "Completed" | "Cancelled";
  startDate?: Date;
  dueDate?: Date;
  progress: number;
  tasks: Types.ObjectId[];
  members: {
    user: Types.ObjectId;
    role: "manager" | "contributor" | "viewer";
  }[];
  tags: string[];
  createdBy: Types.ObjectId;
  isArchived: boolean;
}

export const projectSchema = new Schema<ProjectDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String, trim: true },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"],
      default: "Planning",
    },
    startDate: { type: Date },
    dueDate: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["manager", "contributor", "viewer"],
          default: "contributor",
        },
      },
    ],
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
export default ProjectModel;
