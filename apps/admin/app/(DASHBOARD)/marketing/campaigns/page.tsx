import CampaignForm from "@/components/forms/marketing/CampaignForm";
import { CouponType, database } from "@igraph/database";
import Search from "@igraph/ui/components/Search";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@igraph/ui/components/ui/dialog";
import { pagination } from "@igraph/utils";
import CampaignList from "./CampaginList";

interface Props {
  searchParams: Promise<{
    page: string;
    expired: string;
    search: string;
    type: CouponType;
    usage: string;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { page } = await searchParams;

  //   const orderBy: Prisma.CouponOrderByWithRelationInput[] = [];
  //   if (usage) {
  //     orderBy.push({ used: usage === "most" ? "desc" : "asc" });
  //   } else {
  //     orderBy.push({ id: "desc" });
  //   }

  const { skip, take } = pagination(page);

  const campaigns = await database.campaign.findMany({
    include: {
      campaignMessages: true,
      coupon: {
        include: { payment: { where: { status: "SUCCESS" } } },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  const totalCampaigns = await database.campaign.count();

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalCampaigns} Campaigns</h3>
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <Search placeholder="Search Codes..." />

          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} className="px-6 lg:px-10">
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Campaign</DialogTitle>
                <CampaignForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CampaignList campaigns={campaigns} totalCampaigns={totalCampaigns} />
    </div>
  );
};

export default page;
