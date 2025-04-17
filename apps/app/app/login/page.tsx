import LoginForm from "@/components/forms/login/LoginForm";
import IgraphLogo from "@igraph/ui/components/IgraphLogo";
import { Card } from "@igraph/ui/components/ui/card";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";

export interface LoginFormsProps {
  setLoginStep: Dispatch<SetStateAction<"INPUT" | "OTP" | "REGISTER">>;
  setInputFormValue?: Dispatch<React.SetStateAction<string>>;
  inputFormValue?: string;
  setIsNewUser?: Dispatch<React.SetStateAction<boolean>>;
  isNewUser?: boolean;
}

const page = () => {
  return (
    <div className="mt-5 md:mt-20 w-[350px] mx-auto flex flex-col items-center space-y-5">
      <Link href={"/"}>
        <IgraphLogo />
      </Link>
      <Card className="w-full">
        <LoginForm />
      </Card>
    </div>
  );
};

export default page;
