import { placeHolder } from "@/public";
import { Asset, Image as ImageType } from "@igraph/database";
import EditButton from "@igraph/ui/components/EditButton";
import Pagination from "@igraph/ui/components/Pagination";
import Table from "@igraph/ui/components/Table";
import { Badge } from "@igraph/ui/components/ui/badge";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import ViewButton from "@igraph/ui/components/ViewButton";
import { formatMiladiDate } from "@igraph/utils";
import Image from "next/image";
import Link from "next/link";

export interface AssetType extends Asset {
  image: ImageType | null;
}

interface Props {
  assets: AssetType[];
  totalAssets: number;
  pageSize: number;
}

const AssetsList = async ({ assets, totalAssets, pageSize }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={assets} renderRows={renderRows} />
      <Pagination pageSize={pageSize} totalItems={totalAssets} />
    </div>
  );
};

const renderRows = (asset: AssetType) => {
  return (
    <TableRow key={asset.id} className="odd:bg-slate-50">
      <TableCell>
        <Link
          href={`/assets/${asset.id}`}
          className="flex gap-2 items-center text-primary"
        >
          <Image
            alt="asset"
            src={asset.image?.url || placeHolder}
            width={65}
            height={65}
            className="rounded-sm aspect-video object-cover hidden lg:block bg-muted"
          />
          <span dir="rtl">{asset.title}</span>
        </Link>
      </TableCell>

      <TableCell className="text-center hidden xl:table-cell">
        <Badge
          variant={asset.status === "DRAFT" ? "gray" : "green"}
          className="w-[100px]"
        >
          {asset.status}
        </Badge>
      </TableCell>

      <TableCell className="text-center">
        {(77389).toLocaleString("en-US")}
      </TableCell>

      <TableCell className="text-center">
        {asset.downloadCount.toLocaleString("en-US")}
      </TableCell>

      <TableCell className="text-center hidden xl:table-cell">
        {formatMiladiDate(asset.createdAt)}
      </TableCell>

      <TableCell className="lg:flex gap-2 hidden ">
        <EditButton href={`/assets/${asset.id}`} />
        <ViewButton
          href={`${process.env.NEXT_PUBLIC_MAIN_URL}/assets/${asset.url}`}
        />
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Title", className: "w-[550px]" },
  { label: "Status", className: "text-center hidden xl:table-cell" },
  { label: "Views", className: "text-center" },
  { label: "Downloaded", className: "text-center" },
  { label: "Published At", className: "text-center hidden xl:table-cell" },
  {
    label: "Actions",
    className: "text-right w-[60px] hidden lg:table-cell",
  },
];

export default AssetsList;
