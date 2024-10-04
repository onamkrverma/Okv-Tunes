"use server";
import Users from "@/models/users";
import connectDB from "@/utils/db";
import { genSalt, hash } from "bcrypt";

const signupAction = async (formData: FormData) => {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  await connectDB();

  try {
    if (!name || !email || !password) {
      throw new Error("Please provide all fields");
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const isUserExist = await Users.findOne({ email });
    if (isUserExist) {
      throw new Error("User already exists");
    }

    await Users.create({
      name,
      email,
      password: hashedPassword,
    });
    return { success: true, message: "Signup Success" };
  } catch (error: unknown) {
    if (error instanceof Error)
      console.error("Registration error:", error.message);
    return {
      message: "An error occurred while creating your account.",
      success: false,
    };
  }
};

export default signupAction;
