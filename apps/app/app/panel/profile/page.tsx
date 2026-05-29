import React from "react";
import UserProfileForm from "@/components/forms/profileForm";
import { getSessionUser } from "@/data/user";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { loginPageRoute } from "@/middleware";

const page = async () => {
  const user = await getSessionUser();

  if (!user) redirect(loginPageRoute);

  return <UserProfileForm user={user} />;
};

export default page;

export const metadata: Metadata = {
  title: "پروفایل من",
};
