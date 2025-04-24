import RecaptchaWrapper from "@igraph/ui/components/RecaptchaWrapper";
import { getSessionTutor } from "@/data/tutor";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function layout({ children }: { children: ReactNode }) {
  const session = await getSessionTutor();
  if (session) redirect("/");

  return (
    <div
      className={`max-w-screen-xl mx-auto p-3 grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-screen`}
    >
      <main className="mt-24 w-full max-w-[350px] mx-auto">
        <RecaptchaWrapper
          recaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        >
          {children}
        </RecaptchaWrapper>
      </main>
    </div>
  );
}
