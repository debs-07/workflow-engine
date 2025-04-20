import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoDbConStr = process.env.MONGO_DB_CONNECTION_STRING;
  if (!mongoDbConStr) {
    throw new Error("MONGO_DB_CONNECTION_STRING is not defined");
  }

  await mongoose.connect(mongoDbConStr);
  console.log("MongoDB connected successfully!");
};
