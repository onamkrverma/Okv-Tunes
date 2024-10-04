import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.DATABASE_URI;

  if (!uri) {
    throw new Error(
      "Please define the DATABASE_URI environment variable inside .env.local"
    );
  }

  if (mongoose.connection.readyState >= 1) {
    // If already connected, return the existing connection
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Connection failed!");
  }
};

export default connectDB;
