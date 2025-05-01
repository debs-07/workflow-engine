import { model, Schema } from "mongoose";

export enum taskStatus {
  ToDo = "To-Do",
  InProgress = "In-Progress",
  Done = "Done",
}

export enum taskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export interface ITask {
  title: string;
  description?: string;
  status?: taskStatus;
  priority?: taskPriority;
  dueDate: Date;
  isDeleted: boolean;
  deletedAt: Date;
  userId: Schema.Types.ObjectId;
  projectId?: Schema.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: taskStatus,
      default: taskStatus.ToDo,
    },
    priority: {
      type: String,
      enum: taskPriority,
      default: taskPriority.Low,
    },
    dueDate: {
      type: Date,
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
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for fast search
taskSchema.index({ userId: 1, isDeleted: 1 });
taskSchema.index({ projectId: 1, isDeleted: 1 });

export const Task = model<ITask>("Task", taskSchema);
