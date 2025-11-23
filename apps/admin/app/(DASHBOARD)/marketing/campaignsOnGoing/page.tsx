import CampaignOnGoingForm from "@/components/forms/marketing/CampaignOnGoingForm";
import { database, Prisma } from "@igraph/database";
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
import CampaignOnGoingList from "./CampaignOnGoingList";

interface Props {
  searchParams: Promise<{
    page: string;
    search: string;
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, search } = await searchParams;

  const { skip, take } = pagination(page);

  const where: Prisma.CampaignOnGoingWhereInput = search
    ? {
        title: { contains: search },
      }
    : {};

  const campaigns = await database.campaignOnGoing.findMany({
    where,
    orderBy: { createdAt: "asc" },
    skip,
    take,
  });

  const totalCampaigns = await database.campaignOnGoing.count({ where });

  const campaignsWithSales = await Promise.all(
    campaigns.map(async (campaign) => {
      const totalSells = await database.payment.aggregate({
        where: {
          status: "SUCCESS",
          campaignOnGoingId: campaign.id,
          paidAt: {
            gte: campaign.startAt,
            lte: campaign.endAt,
          },
        },
        _sum: {
          total: true,
        },
      });

      return {
        ...campaign,
        totalSells: totalSells._sum.total || 0,
      };
    })
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalCampaigns} Campaigns</h3>
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <Search placeholder="Search Title..." />

          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} className="px-6 lg:px-10">
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Campaign</DialogTitle>
                <CampaignOnGoingForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CampaignOnGoingList
        campaigns={campaignsWithSales}
        totalCampaigns={totalCampaigns}
      />
    </div>
  );
};

export default page;
