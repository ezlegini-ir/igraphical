import {
  Table as MyTable,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@igraph/ui/components/ui/table";
import { Frown } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  columns: { label: string; className?: string }[];
  data: any[];
  renderRows: (item: any, index?: number) => ReactNode;
  noDataMessage?: string;
}

const Table = ({ columns, data, renderRows, noDataMessage }: Props) => {
  return (
    <>
      <MyTable>
        <TableHeader>
          <TableRow className="text-gray-500 text-sm text-left bg-slate-50">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={`text-left ${column.className} h-10`}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((data, index) => renderRows(data, index))}
        </TableBody>
      </MyTable>

      {data.length < 1 && (
        <div className="py-20 text-gray-500 flex flex-col gap-3 justify-center items-center text-sm">
          <Frown size={80} className="text-gray-400" strokeWidth={1.5} />
          {noDataMessage}
        </div>
      )}
    </>
  );
};

export default Table;
