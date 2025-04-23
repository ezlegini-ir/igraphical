import React from "react";
import UserProfileForm from "@/components/forms/profileForm";
import { getSessionUser } from "@/data/user";
import { Metadata } from "next";

const page = async () => {
  const user = await getSessionUser();

  return <UserProfileForm user={user!} />;
};

export default page;

export const metadata: Metadata = {
  title: "پروفایل من",
};
