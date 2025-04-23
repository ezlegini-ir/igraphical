import LoginForm from "@/components/forms/login/LoginForm";
import IgraphLogo from "@igraph/ui/components/IgraphLogo";
import Link from "next/link";

const page = async () => {
  return (
    <div className="flex flex-col gap-5 items-center">
      <Link href={"#"}>
        <IgraphLogo />
      </Link>

      <div className="card p-5 w-full space-y-3">
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
