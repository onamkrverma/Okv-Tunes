"use client";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import signupAction from "../actions/signup";

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (formData: FormData) => {
    setErrorMessage("");
    try {
      const res = await signupAction(formData);
      if (!res.success) {
        return setErrorMessage(res.message);
      }
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full p-4 ">
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>

      <div className="bg-primary/50 flex flex-col gap-4 items-center p-5 rounded-xl border shadow-neutral-500 shadow-md w-full max-w-md">
        <img src="/logo-full.svg" alt="okv tunes" className="h-12" />
        <p>Sign up and unlock unlimited free music!</p>
        <form
          action={handleSignup}
          className="flex flex-col gap-2 items-center w-full"
        >
          <Input
            name="name"
            type="text"
            label="Name"
            autoComplete="name"
            placeholder="Jonh"
            required
          />
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
            autoComplete="new-password"
            aria-autocomplete="list"
            required
            minLength={8}
            placeholder="Your password"
          />

          <button
            type="submit"
            title="signup"
            className="bg-neutral-800 w-full mt-2 text-primary rounded-lg p-3 border hover:bg-action"
          >
            Signup
          </button>
          {errorMessage ? (
            <p className="text-action text-sm my-2 bg-neutral-50 p-1 px-4 rounded-md text-center">
              {errorMessage}
            </p>
          ) : null}
        </form>
        <p>
          Have an account?
          <Link
            href="/login"
            className="text-action-600 hover:underline underline-offset-2 ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
