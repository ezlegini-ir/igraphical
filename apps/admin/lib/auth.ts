import { getSessionAdmin } from "@/data/admin";
import { loginPageRoute } from "@/middleware";
import { redirect } from "next/navigation";

export const authenticateSession = async () => {
  const admin = await getSessionAdmin();

  if (!admin) redirect(loginPageRoute);
};
