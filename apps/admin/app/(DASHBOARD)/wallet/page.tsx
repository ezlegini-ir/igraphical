import { database } from "@igraph/database";
import TransactionsList from "./TransactionsList";
import { globalPageSize, pagination } from "@igraph/utils";
import { Prisma, TransactionType } from "@igraph/database";
import BestWallets from "./BestWallets";
import WalletForm from "@/components/forms/wallet/WalletForn";

interface Props {
  searchParams: Promise<{
    page: string;
    type: TransactionType;
    search: string;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, type, search } = await searchParams;

  const where: Prisma.WalletTransactionWhereInput = {
    type: type,
    OR: search
      ? [
          { wallet: { user: { email: { contains: search } } } },
          { wallet: { user: { phone: { contains: search } } } },
          { wallet: { user: { nationalId: { contains: search } } } },
          { wallet: { user: { fullName: { contains: search } } } },
        ]
      : undefined,
  };

  const { skip, take } = pagination(page);
  const transactions = await database.walletTransaction.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      wallet: {
        include: {
          user: true,
        },
      },
    },

    skip,
    take,
  });

  const totalTransactions = await database.walletTransaction.count({ where });

  const bestWallets = await database.wallet.findMany({
    include: {
      user: { include: { image: true } },
    },
    orderBy: {
      balance: "desc",
    },
    take: 5,
  });

  return (
    <div className="space-y-3">
      <h3>Wallet Managment</h3>

      <div className="grid grid-cols-12 gap-3">
        <WalletForm />

        <BestWallets bestWallets={bestWallets} />

        <TransactionsList
          totalTransactions={totalTransactions}
          transactions={transactions}
          pageSize={globalPageSize}
        />
      </div>
    </div>
  );
};

export default page;
