import { Metadata } from "next";
import CheckoutResult from "./CheckoutResult";
import { PaymentMethod } from "@igraph/database";
interface Props {
  searchParams: Promise<{
    Authority: string;
    Status: "OK" | "NOK";
    paymentMethod: PaymentMethod;
    trackingCode: string;
    providerId: string;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { Authority, Status, paymentMethod, providerId, trackingCode } =
    await searchParams;

  return (
    <CheckoutResult
      authority={Authority}
      status={Status}
      paymentMethod={paymentMethod}
      providerId={providerId}
      trackingCode={trackingCode}
    />
  );
};

export default page;

export const metadata: Metadata = {
  title: "تایید تراکنش",
  description: "آی‌گرافیکال: جایی که خلاقیت جان می‌گیرد!",
};
