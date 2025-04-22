import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING!);
  console.log("MongoDB connected successfully!");
};
