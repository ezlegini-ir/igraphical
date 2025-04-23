import TicketForm from "@/components/forms/ticket/TicketForm";
import React from "react";

const page = () => {
  return (
    <div className="space-y-3">
      <h3>Create a New Ticket</h3>

      <TicketForm type="NEW" />
    </div>
  );
};

export default page;
