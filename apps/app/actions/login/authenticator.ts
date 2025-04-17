"use server";

import { signIn } from "@igraph/auth";

export const authenticator = async (identifier: string) => {
  const response = await signIn("user-login", {
    identifier,
    redirect: false,
  });

  if (response?.error) return { error: "Invalid credentials" };

  return { success: "ورود موفقیت آمیز. خوش آمدید!" };
};
