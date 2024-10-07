import React from "react";

const Privacy = () => {
  return (
    <div className="inner-container p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. This privacy policy explains how we
        collect, use, and protect your information.
      </p>

      <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We collect the following information from you when you use our service:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Username</li>
        <li>Email address</li>
        <li>Profile image</li>
        <li>Liked songs data</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">
        2. How We Use Your Information
      </h2>
      <p className="mb-4">
        We use your information to provide and improve our service, personalize
        your experience, and communicate with you.
      </p>

      <h2 className="text-2xl font-semibold mb-2">
        3. Sharing Your Information
      </h2>
      <p className="mb-4">
        We do not share your personal information with third parties except as
        necessary to provide our service or as required by law.
      </p>

      <h2 className="text-2xl font-semibold mb-2">4. Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your information from
        unauthorized access, use, or disclosure.
      </p>

      <h2 className="text-2xl font-semibold mb-2">5. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this privacy policy from time to time. We will notify you
        of any changes by posting the new policy on our website.
      </p>

      <h2 className="text-2xl font-semibold mb-2">6. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at support@okvtunes.com.
      </p>
    </div>
  );
};

export default Privacy;
