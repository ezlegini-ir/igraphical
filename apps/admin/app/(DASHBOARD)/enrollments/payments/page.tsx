import { paymentStatus } from "@/lib/validationSchema";
import { database, PaymentStatus, Prisma } from "@igraph/database";
import Filter from "@igraph/ui/components/Filter";
import NewButton from "@igraph/ui/components/NewButton";
import Search from "@igraph/ui/components/Search";
import { globalPageSize, pagination } from "@igraph/utils";
import PaymentsList from "./PaymentsList";

interface Props {
  searchParams: Promise<{ page: string; status: string; search: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, status, search } = await searchParams;

  const where: Prisma.PaymentWhereInput = {
    user: search
      ? {
          OR: [
            { fullName: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
            { nationalId: { contains: search } },
          ],
        }
      : undefined,
    status: status ? (status as PaymentStatus) : undefined,
  };

  const { skip, take } = pagination(page);
  const payments = await database.payment.findMany({
    where,
    include: {
      user: {
        include: {
          image: true,
        },
      },
      enrollment: {
        include: {
          course: {
            include: {
              image: true,
            },
          },
        },
      },
    },
    orderBy: { id: "desc" },

    skip,
    take,
  });
  const totalPayments = await database.payment.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalPayments} Payments</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search placeholder="Search Users..." />

          <Filter
            placeholder="All Statuses"
            name="status"
            options={paymentStatus.map((status) => ({
              label: status,
              value: status,
            }))}
          />

          <NewButton href="/enrollments/new" title="New Payment" />
        </div>
      </div>

      <PaymentsList
        payments={payments}
        totalPayments={totalPayments}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
