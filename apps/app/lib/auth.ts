import { getSessionUser } from "@/data/user";
import { loginPageRoute } from "@/middleware";
import { redirect } from "next/navigation";

export const authenticateSession = async () => {
  const user = await getSessionUser();

  if (!user) redirect(loginPageRoute);
};
