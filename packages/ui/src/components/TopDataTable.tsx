import CardBox from "@igraph/ui/components/CardBox";
import Table from "@igraph/ui/components/Table";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import Link from "next/link";

interface Column {
  label: string;
  className?: string;
}

interface data {
  title: string;
  href: string;
  count: number;
}

interface Props {
  title: string;
  referTo: string;
  data: data[];
  className?: string;
  columns: Column[];
}

const TopDataTable = ({ data, title, referTo, className, columns }: Props) => {
  return (
    <CardBox
      btn={{ title: "View All", href: referTo }}
      title={title}
      className={className}
    >
      <Table
        columns={columns}
        data={data}
        renderRows={renderRows}
        noDataMessage="No Data Available"
      />
    </CardBox>
  );
};

const renderRows = (data: data) => {
  return (
    <TableRow className="text-xs text-gray-500">
      <TableCell>
        <Link href={data.href}>{data.title}</Link>
      </TableCell>
      <TableCell className="text-right">
        {data.count.toLocaleString("en-US")}
      </TableCell>
    </TableRow>
  );
};

export default TopDataTable;
