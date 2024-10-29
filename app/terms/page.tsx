import BackButton from "@/components/BackButton";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Terms of Service • Okv-Tunes",
};

const Terms = () => {
  return (
    <div className="inner-container p-6">
      <BackButton />
      <h1 className="text-3xl font-bold my-4">Terms of Service</h1>
      <p className="mb-4">
        Welcome to OKV Tunes! By using our service, you agree to the following
        terms and conditions:
      </p>

      <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing and using OKV Tunes, you accept and agree to be bound by
        the terms and provision of this agreement.
      </p>

      <h2 className="text-2xl font-semibold mb-2">2. Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to modify these terms at any time. Your continued
        use of the service signifies your acceptance of any changes.
      </p>

      <h2 className="text-2xl font-semibold mb-2">3. User Accounts</h2>
      <p className="mb-4">
        You must provide accurate and complete information when creating an
        account. You are responsible for maintaining the confidentiality of your
        account and password.
      </p>

      <h2 className="text-2xl font-semibold mb-2">4. Use of Service</h2>
      <p className="mb-4">
        You agree not to use the service for any unlawful or prohibited
        activities. You must comply with all applicable laws and regulations.
      </p>

      <h2 className="text-2xl font-semibold mb-2">5. Termination</h2>
      <p className="mb-4">
        We may terminate or suspend your account and access to the service at
        our sole discretion, without prior notice or liability, for any reason
        whatsoever.
      </p>

      <h2 className="text-2xl font-semibold mb-2">6. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please vist our
        <Link href={"/contact"} className="underline mx-2">
          contact us
        </Link>
        page and submit your query.
      </p>
    </div>
  );
};

export default Terms;
