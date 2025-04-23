import { Metadata } from "next";
import CheckoutResult from "./CheckoutResult";
interface Props {
  searchParams: Promise<{
    Authority: string;
    Status: "OK" | "NOK";
    Type: "QUICK" | "PAYMENT";
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { Authority, Status, Type } = await searchParams;

  return <CheckoutResult authority={Authority} status={Status} type={Type} />;
};

export default page;

export const metadata: Metadata = {
  title: "تایید تراکنش",
  description: "آی‌گرافیکال: جایی که خلاقیت جان می‌گیرد!",
};
