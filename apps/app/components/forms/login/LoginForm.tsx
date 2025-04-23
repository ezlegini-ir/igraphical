"use client";

import { useState } from "react";
import InputForm from "./InputForm";
import OtpForm from "./OtpForm";
import RegisterForm from "./RegisterForm";
import RecaptchaWrapper from "@igraph/ui/components/RecaptchaWrapper";

const LoginForm = () => {
  // HOOKS
  const [loginStep, setLoginStep] = useState<"INPUT" | "OTP" | "REGISTER">(
    "INPUT"
  );
  const [inputFormValue, setInputFormValue] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  return (
    <>
      {loginStep === "INPUT" && (
        <RecaptchaWrapper
          recaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        >
          <InputForm
            setIsNewUser={setIsNewUser}
            setLoginStep={setLoginStep}
            setInputFormValue={setInputFormValue}
          />
        </RecaptchaWrapper>
      )}
      {loginStep === "OTP" && (
        <RecaptchaWrapper
          recaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        >
          <OtpForm
            setLoginStep={setLoginStep}
            inputFormValue={inputFormValue}
            isNewUser={isNewUser}
          />
        </RecaptchaWrapper>
      )}
      {loginStep === "REGISTER" && (
        <RegisterForm
          setLoginStep={setLoginStep}
          inputFormValue={inputFormValue}
        />
      )}
    </>
  );
};

export default LoginForm;
