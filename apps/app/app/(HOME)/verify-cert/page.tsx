import CertificateVerifyForm from "@/components/forms/certificate/CertificateVerifyForm";
import PageTitle from "@igraph/ui/components/PageTitle";
import RecaptchaWrapper from "@igraph/ui/components/RecaptchaWrapper";
import { Metadata } from "next";
import React from "react";

const page = () => {
  return (
    <div className="flex items-center flex-col gap-3">
      <PageTitle
        title={"استعلام مدرک"}
        description={"در این صفحه می توانید مدرک آی‌گرافیکال را استعلام کنید."}
      />

      <RecaptchaWrapper
        recaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      >
        <CertificateVerifyForm />
      </RecaptchaWrapper>
    </div>
  );
};

export default page;

export const metadata: Metadata = {
  title: "استعلام مدرک",
  description:
    "استعلام آنلاین مدرک دوره‌های گذرانده‌شده در آی‌گرافیکال. به‌سادگی و تنها با وارد کردن سریال مدرک اعتبار مدرک خود را بررسی کنید.",
};
