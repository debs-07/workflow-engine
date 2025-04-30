import { model, Schema } from "mongoose";

export interface IProject {
  name: string;
  description?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  userId: Schema.Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for unique name + user combination(apply uniqueness only when isDeleted is false)
projectSchema.index({ name: 1, userId: 1 }, { unique: true, partialFilterExpression: { isDeleted: { $eq: false } } });
// Compound index for faster fetching
projectSchema.index({ userId: 1, isDeleted: 1 });

export const Project = model("Project", projectSchema);
