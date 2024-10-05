"use server";
import { signIn, signOut } from "@/auth";
import { CredentialsSignin } from "next-auth";

export const loginAction = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    const err = error as CredentialsSignin;
    return { error: err.message };
  }
};

export const logoutAction = async () => {
  await signOut({ redirect: false });
};

export const gooogleLoginAction = async () => {
  await signIn("google", { redirect: false });
};
