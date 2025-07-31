import mongoose, { Schema, Document, Types } from "mongoose";

export interface taskSchemaType extends Document {
  title: string;
  description?: string;
  project: Types.ObjectId;
  status: "To Do" | "In Progress" | "Review" | "Done";
  priority: "Low" | "Medium" | "High";
  assignees: Types.ObjectId[];
  watchers: Types.ObjectId[];
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  subtasks: {
    title: string;
    completed: boolean;
    createdAt: Date;
  }[];
  comments: Types.ObjectId[];
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
    uploadedBy: Types.ObjectId;
    uploadedAt: Date;
  }[];
  createdBy: Types.ObjectId;
  isArchived: boolean;
}

export const taskSchema = new Schema<taskSchemaType>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Review", "Done"],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    watchers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dueDate: { type: Date },
    completedAt: { type: Date },
    estimatedHours: { type: Number, min: 0 },
    actualHours: { type: Number, min: 0 },
    tags: [{ type: String }],
    subtasks: [
      {
        title: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    attachments: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String },
        fileSize: { type: Number },
        uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model<taskSchemaType>("Task", taskSchema);
export default TaskModel;
