import PaymentForm from "@/components/forms/payment/PaymentForm";
import React from "react";

const page = () => {
  return (
    <div className="space-y-3">
      <h3>Create new Payment</h3>

      <PaymentForm type="NEW" />
    </div>
  );
};

export default page;
