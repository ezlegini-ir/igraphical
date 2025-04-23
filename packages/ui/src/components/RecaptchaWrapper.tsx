"use client";

import { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const RecaptchaWrapper = ({
  children,
  recaptchaKey,
}: {
  children: ReactNode;
  recaptchaKey: string;
}) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default RecaptchaWrapper;
