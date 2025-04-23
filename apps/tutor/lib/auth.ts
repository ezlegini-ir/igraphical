import { getSessionTutor } from "@/data/tutor";
import { loginPageRoute } from "@/middleware";
import { redirect } from "next/navigation";

export const authenticateSession = async () => {
  const admin = await getSessionTutor();

  if (!admin) redirect(loginPageRoute);
};
