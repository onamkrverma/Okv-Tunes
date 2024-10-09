"use server";

export const contactAction = async (formData: FormData) => {
  try {
    const formDataObj = Object.fromEntries(formData.entries());
    const { name, email, subject, message } = formDataObj;

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        access_key: process.env.FORM_ACCESS_KEY,
        from_name: "Okv Tunes Contact Us",
      }),
    });
    if (response.status !== 200) {
      return { error: "Failed to send mail", status: response.status };
    }
    return {
      success:
        "Your message has been sent successfully. We will contact you shortly",
      status: response.status,
    };
  } catch (error) {
    return { error: "Internal server error", status: 500 };
  }
};
