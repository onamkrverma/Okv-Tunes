"use client";
import Input from "@/components/Input";
import { gooogleLoginAction, loginAction } from "../actions/auth";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/public/icons/google.svg";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    setErrorMessage("");
    if (!email || !password) {
      return setErrorMessage("Please provide all fields");
    }
    const res = await loginAction(email, password);
    if (res?.error) {
      return setErrorMessage(res.error);
    }
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center h-screen w-full p-4 ">
      <div className="bg-primary/50 flex flex-col gap-4 items-center p-5 rounded-xl border shadow-neutral-500 shadow-md w-full max-w-md">
        <img src="/logo-full.svg" alt="okv tunes" className="h-12" />
        <p>Sign in and enjoy unlimited free music!</p>
        <form action={gooogleLoginAction}>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 border bg-primary hover:bg-secondary rounded-xl p-2 px-4"
          >
            <GoogleIcon className="w-6 h-6" /> Signin with Google
          </button>
        </form>

        <div className="w-full flex justify-center items-center relative border-t my-2 ">
          <span className="px-2 bg-[#130f10] absolute -top-3">OR</span>
        </div>

        <form
          className="flex flex-col gap-2 items-center w-full"
          action={handleLogin}
        >
          <Input
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            placeholder="example@gmail.com"
            required
          />

          <Input
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
            minLength={8}
            placeholder="Your password"
          />

          <button
            type="submit"
            title="login"
            className="bg-neutral-800 w-full mt-2 text-primary rounded-lg p-3 border hover:bg-action"
          >
            Login
          </button>
          {errorMessage ? (
            <p className="text-action text-sm my-2 bg-neutral-50 p-1 px-4 rounded-md text-center">
              {errorMessage}
            </p>
          ) : null}
        </form>
        <p>
          {`Don't have an account?`}
          <Link
            href="/signup"
            className="text-action-600 hover:underline underline-offset-2 ml-1"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
