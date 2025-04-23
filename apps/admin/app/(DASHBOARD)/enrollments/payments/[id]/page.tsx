import EnrollmentForm from "@/components/forms/payment/PaymentForm";
import { database } from "@igraph/database";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;

  const payment = await database.payment.findUnique({
    where: { id: +id },
    include: {
      user: true,
      enrollment: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!payment) return notFound();

  return (
    <div className="space-y-3">
      <h3>Update Enrollment/Payment</h3>

      <EnrollmentForm type="UPDATE" payment={payment} />
    </div>
  );
};

export default page;
