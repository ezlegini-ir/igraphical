"use client";

import { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const RecaptchaWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default RecaptchaWrapper;
