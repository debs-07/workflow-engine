import { model, Schema } from "mongoose";

export interface IProject {
  name: string;
  description?: string;
  isDeleted: boolean;
  deletedAt: Date;
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

// Compound index for unique name + user combination, only for non-deleted projects
projectSchema.index(
  { name: 1, userId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: { $eq: false } } }, // Apply uniqueness only when isDeleted is false
);

export const Project = model("Project", projectSchema);
