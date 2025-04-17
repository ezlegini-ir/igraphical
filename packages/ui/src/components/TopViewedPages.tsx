import Table from "@igraph/ui/components/Table";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import { formatNumber } from "@igraph/utils";
import Link from "next/link";
import React from "react";

interface Props {
  topViewedPages: { page: string; href: string; views: number }[];
}

const TopViewedPages = ({ topViewedPages }: Props) => {
  return (
    <div className="card col-span-6 2xl:col-span-3 p-6">
      <p className="font-medium">Top Pages</p>

      <Table
        columns={columns}
        data={topViewedPages}
        renderRows={renderRows}
        noDataMessage="No Data Available"
      />
    </div>
  );
};

const renderRows = (data: { page: string; href: string; views: number }) => {
  return (
    <TableRow className="text-xs text-gray-500 odd:bg-slate-50" key={data.href}>
      <TableCell>
        <Link
          dir="rtl"
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/${data.href}`}
        >
          {data.page.length > 45 ? data.page.slice(0, 45) + "...." : data.page}
        </Link>{" "}
      </TableCell>
      <TableCell className="text-right">{formatNumber(data.views)}</TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Page", className: "text-left" },
  { label: "Views", className: "w-[50px]" },
];

export default TopViewedPages;
