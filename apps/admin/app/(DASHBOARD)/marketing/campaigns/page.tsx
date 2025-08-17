import CampaignForm from "@/components/forms/marketing/CampaignForm";
import { CouponType, database } from "@igraph/database";
import Filter from "@igraph/ui/components/Filter";
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
  const { page, expired, search, type, usage } = await searchParams;

  //   const orderBy: Prisma.CouponOrderByWithRelationInput[] = [];
  //   if (usage) {
  //     orderBy.push({ used: usage === "most" ? "desc" : "asc" });
  //   } else {
  //     orderBy.push({ id: "desc" });
  //   }

  const { skip, take } = pagination(page);

  const campaigns = await database.campaign.findMany({
    include: {
      CampaignMessages: true,
      coupon: {
        include: { payment: { where: { status: "SUCCESS" } } },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  const totalCampaigns = await database.coupon.count();

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalCampaigns} Campaigns</h3>
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <Search placeholder="Search Codes..." />

          <Filter
            placeholder="All Dates"
            name="expired"
            options={[
              { label: "Expired", value: "true" },
              { label: "Not Expired", value: "false" },
            ]}
          />

          <Filter
            placeholder="All Types"
            name="type"
            options={[
              { label: "Fixed on Card", value: "FIXED_ON_CART" },
              { label: "Fixed on Course", value: "FIXED_ON_COURSE" },
              { label: "Percent", value: "PERCENT" },
            ]}
          />

          <Filter
            placeholder="All Usage"
            name="usage"
            options={[
              { label: "Most Used", value: "most" },
              { label: "Lowest Used", value: "lowest" },
            ]}
          />

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
