import Table from "@igraph/ui/components/Table";
import { Button } from "@igraph/ui/components/ui/button";

import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import { formatNumber } from "@igraph/utils";
import Link from "next/link";

interface Props {
  tableData: {
    title: string;
    sessions: number;
    views: number;
  }[];
}

const ViewsTable = ({ tableData }: Props) => {
  return (
    <div className="card col-span-6 2xl:col-span-3 p-6 space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-medium">Views Data</p>
        <Link href={"#"}>
          <Button className="h-6" variant={"secondary"} size={"sm"}>
            Statistics
          </Button>
        </Link>
      </div>

      <Table columns={columns} data={tableData} renderRows={renderRows} />
    </div>
  );
};

export default ViewsTable;

const renderRows = (data: {
  title: string;
  sessions: number;
  views: number;
}) => {
  return (
    <TableRow className="last:font-semibold last:bg-slate-50" key={data.title}>
      <TableCell className="text-gray-500 last:font-bold">
        {data.title}
      </TableCell>
      <TableCell className="text-center text-orange-600">
        {formatNumber(data.sessions)}
      </TableCell>
      <TableCell className="text-right text-primary">
        {formatNumber(data.views)}
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Title", className: "text-left w-1/2" },
  { label: "Sessions", className: "text-center w-1/3" },
  { label: "Views", className: "w-1/3 text-right" },
];
