import { database } from "@igraph/database";
import PaymentsList from "./PaymentsList";
import { getSessionUser } from "@/data/user";
import { Metadata } from "next";

const page = async () => {
  const userId = (await getSessionUser())?.id;

  const payments = await database.payment.findMany({
    where: { userId, total: { gt: 0 } },
    orderBy: { id: "desc" },
    include: {
      enrollment: {
        include: {
          course: {
            include: { image: true },
          },
        },
      },
    },
  });

  return <PaymentsList payments={payments} />;
};

export default page;

export const metadata: Metadata = {
  title: "پرداخت‌ها",
};
