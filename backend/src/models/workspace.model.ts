import mongoose, { Schema, Document, Types } from "mongoose";

export interface WorkspaceDocument extends Document {
  name: string;
  description?: string;
  color: string;
  owner: Types.ObjectId;
  members: {
    user: Types.ObjectId;
    role: "owner" | "member" | "admin" | "viewer";
    joinedAt: Date;
  }[];
  projects: Types.ObjectId[];
}

const workspaceSchema = new Schema<WorkspaceDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String, trim: true },
    color: { type: String, default: "#FF5733" },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["owner", "member", "admin", "viewer"],
          default: "member",
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

const WorkspaceModel = mongoose.model<WorkspaceDocument>(
  "Workspace",
  workspaceSchema
);
export default WorkspaceModel;
