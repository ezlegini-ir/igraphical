import TicketForm from "@/components/forms/TicketForm";
import { Metadata } from "next";
import React from "react";

const page = () => {
  return <TicketForm />;
};

export default page;

export const metadata: Metadata = {
  title: "تیکت جدید",
};
