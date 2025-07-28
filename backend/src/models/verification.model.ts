import mongoose, { Schema, Document, Types } from "mongoose";

export interface VerificationDocument extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const verificationSchema = new Schema<VerificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const VerificationModel = mongoose.model<VerificationDocument>(
  "Verification",
  verificationSchema
);
export default VerificationModel;
