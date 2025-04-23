"use server";

import { signIn } from "@igraph/auth";
import { redirect } from "next/navigation";

export const authenticator = async (identifier: string) => {
  const res = await signIn("admin-login", {
    identifier,
    redirect: false,
  });

  if (res.error) return { error: "Invalid Credentials" };

  redirect("/");
};
