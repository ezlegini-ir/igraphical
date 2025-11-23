import CampaignOnGoingForm from "@/components/forms/marketing/CampaignOnGoingForm";
import { CampaignOnGoing } from "@igraph/database";
import EditButton from "@igraph/ui/components/EditButton";
import Pagination from "@igraph/ui/components/Pagination";
import Table from "@igraph/ui/components/Table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { TableCell, TableRow } from "@igraph/ui/components/ui/table";
import { formatPrice, globalPageSize } from "@igraph/utils";
import { formatDate } from "date-fns";

type CampaignType = CampaignOnGoing & { totalSells: number };

interface Props {
  campaigns: CampaignType[];
  totalCampaigns: number;
}

const CampaignOnGoingList = async ({ campaigns, totalCampaigns }: Props) => {
  return (
    <div className="card">
      <Table columns={columns} data={campaigns} renderRows={renderRows} />
      <Pagination pageSize={globalPageSize} totalItems={totalCampaigns} />
    </div>
  );
};

const renderRows = (campaign: CampaignType) => {
  return (
    <TableRow key={campaign.id} className="odd:bg-slate-50">
      <TableCell dir="rtl" className="text-left">
        {campaign.title}
      </TableCell>

      <TableCell className="text-center">
        {formatDate(campaign.startAt, "PP")}
      </TableCell>

      <TableCell className="text-center">
        {formatDate(campaign.endAt, "PP")}
      </TableCell>

      <TableCell className="text-center">
        {formatPrice(campaign.totalSells)}
      </TableCell>

      <TableCell className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <EditButton />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="space-y-6">
              <DialogTitle>New Campaign</DialogTitle>
              <CampaignOnGoingForm campaign={campaign} type="UPDATE" />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const columns = [
  { label: "Title", className: "" },
  { label: "Start", className: "text-center" },
  { label: "End", className: "text-center" },
  { label: "Total Sells", className: "text-center" },
  { label: "Action", className: "text-right" },
];

export default CampaignOnGoingList;
