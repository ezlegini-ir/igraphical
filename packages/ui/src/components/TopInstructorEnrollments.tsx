import CardBox from "@/app/panel/components/CardBox";
import Table from "@igraph/ui/components/Table";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import Link from "next/link";

interface Props {
  courses: {
    title: string;
    href: string;
    studentsCount: number;
  }[];
}

const TopInstructorEnrollments = ({ courses }: Props) => {
  return (
    <CardBox
      btn={{ title: "View All", href: "#" }}
      title="Top Enrolled Courses"
      className="col-span-3"
    >
      <Table
        columns={columns}
        data={courses}
        renderRows={renderRows}
        noDataMessage="No Data Available"
      />
    </CardBox>
  );
};

const renderRows = (data: {
  title: string;
  href: string;
  studentsCount: number;
}) => {
  return (
    <TableRow className="text-xs text-gray-500">
      <TableCell className="flex flex-col gap-1">
        <Link href={data.href}>{data.title}</Link>
      </TableCell>
      <TableCell className="text-right">
        {data.studentsCount.toLocaleString("en-US")}
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Course", className: "text-left" },
  { label: "Students", className: "w-[50px]" },
];

export default TopInstructorEnrollments;
