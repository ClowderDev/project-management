import mongoose, { Schema, Document, Types } from "mongoose";

export interface WorkspaceInviteDocument extends Document {
  user: Types.ObjectId;
  workspaceId: Types.ObjectId;
  token: string;
  role: "admin" | "member" | "viewer";
  expiresAt: Date;
}

export const workspaceInviteSchema = new Schema<WorkspaceInviteDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const WorkspaceInviteModel = mongoose.model<WorkspaceInviteDocument>(
  "WorkspaceInvite",
  workspaceInviteSchema
);
export default WorkspaceInviteModel;
