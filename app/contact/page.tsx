"use client";
import Input from "@/components/Input";
import React, { useRef, useState } from "react";
import { contactAction } from "../actions/contact";

const Contact = () => {
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSendMessage = async (formData: FormData) => {
    setMessage("");
    const res = await contactAction(formData);
    console.log(res);
    const { error, success } = res;
    if (success) {
      setMessage(success);
      formRef.current?.reset();
      return;
    }
    if (error) return setMessage(error);
  };

  return (
    <div className="inner-container flex gap-2 flex-col">
      <h1 className="text-2xl font-bold">Contact Us</h1>
      <p>
        We are here to assist you. Please submit your query using the form below
      </p>
      <div className="flex gap-2 justify-evenly flex-wrap items-center">
        <div className="flex items-center justify-center">
          <img src="/contact.webp" alt="customer care" width={400} />
        </div>
        <div className="flex flex-col gap-2 bg-primary rounded-2xl shadow-md p-6 w-full max-w-md">
          <p className="text-center border-b border-neutral-400 pb-2">
            New message
          </p>
          <form
            action={handleSendMessage}
            className="flex flex-col gap-2"
            ref={formRef}
          >
            <div className="flex justify-between gap-4 flex-col sm:flex-row items-center">
              <Input
                name="name"
                type="text"
                label="Name"
                minLength={3}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                minLength={3}
                required
              />
            </div>
            <Input
              name="subject"
              type="text"
              label="Subject"
              placeholder="Subject of Your Inquiry"
              minLength={3}
              required
            />
            <label className="flex flex-col gap-2 w-full">
              Message
              <textarea
                name="message"
                className="text-primary w-full rounded-lg border-0 p-2 px-3 shadow-sm bg-secondary placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-action-300 transition-colors sm:text-sm sm:leading-6 focus-visible:outline-none"
                placeholder="Please provide a detailed description of your issue here."
                minLength={10}
                rows={5}
                required
              />
            </label>
            <button
              type="submit"
              title="Send"
              className="bg-neutral-800 w-full mt-2 text-primary rounded-lg p-3 border hover:bg-action"
            >
              Send
            </button>
            {message ? (
              <p className="text-action text-sm my-2 bg-neutral-50 p-1 px-4 rounded-md text-center">
                {message}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
