import Filter from "@igraph/ui/components/Filter";
import Pagination from "@igraph/ui/components/Pagination";
import Search from "@igraph/ui/components/Search";
import Table from "@igraph/ui/components/Table";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import { formatMiladiDate } from "@igraph/utils";
import { formatPrice } from "@igraph/utils";
import { User, Wallet, WalletTransaction } from "@igraph/database";

interface WalletTransactionType extends WalletTransaction {
  wallet: Wallet & { user: User };
}

interface Props {
  transactions: WalletTransactionType[];
  totalTransactions: number;
  pageSize: number;
}

const TransactionsList = async ({
  transactions,
  totalTransactions: totalContacts,
  pageSize,
}: Props) => {
  return (
    <div className="col-span-12 xl:col-span-6 card">
      <div className="flex justify-between items-center">
        <h4 className="text-gray-600">Latest Transactions</h4>

        <div className="flex gap-3">
          <Search placeholder="Search Users..." />
          <Filter
            placeholder="All Types"
            name="type"
            options={[
              { label: "Decrement", value: "DECREMENT" },
              { label: "Increment", value: "INCREMENT" },
            ]}
          />
        </div>
      </div>

      <Table columns={columns} data={transactions} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalContacts} />
    </div>
  );
};

const renderRows = (trans: WalletTransactionType) => {
  const decrement = trans.type === "DECREMENT";

  return (
    <TableRow key={trans.id} className="odd:bg-slate-50">
      <TableCell className="hidden xl:table-cell">
        {trans.wallet.user.email}
      </TableCell>
      <TableCell className="hidden xl:table-cell">
        {formatMiladiDate(trans.createdAt)}
      </TableCell>
      <TableCell
        className={`hidden xl:table-cell ${decrement ? "text-red-400" : "text-green-500"} `}
      >
        {decrement && "-"}
        {formatPrice(trans.amount)}
      </TableCell>
      <TableCell className="text-center capitalize" dir="rtl">
        {trans.type.toLowerCase().slice(0, 2)}
      </TableCell>
      <TableCell className="text-center" dir="rtl">
        {trans.description}
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "User", className: "hidden xl:table-cell" },
  { label: "Date", className: "" },
  { label: "Amount", className: "" },
  { label: "Type", className: "text-center" },
  {
    label: "Description",
    className: "text-right hidden lg:table-cell",
  },
];

export default TransactionsList;
