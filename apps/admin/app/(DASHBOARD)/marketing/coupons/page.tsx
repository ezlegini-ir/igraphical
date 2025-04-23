import Filter from "@igraph/ui/components/Filter";
import CouponForm from "@/components/forms/marketing/CouponForm";
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
import CouponsList from "./CouponsList";
import { CouponType, Prisma, database } from "@igraph/database";

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

  const where: Prisma.CouponWhereInput = {
    to: expired
      ? expired === "true"
        ? { lt: new Date() }
        : { gte: new Date() }
      : undefined,
    type: type
      ? type === "FIXED_ON_CART"
        ? "FIXED_ON_CART"
        : type === "FIXED_ON_COURSE"
          ? "FIXED_ON_COURSE"
          : "PERCENT"
      : undefined,
    code: search ? { contains: search } : undefined,
  };
  const orderBy: Prisma.CouponOrderByWithRelationInput[] = [];
  if (usage) {
    orderBy.push({ used: usage === "most" ? "desc" : "asc" });
  } else {
    orderBy.push({ id: "desc" });
  }

  const { skip, take } = pagination(page);

  const coupons = await database.coupon.findMany({
    where,
    include: {
      courseExclude: true,
      courseInclude: true,
    },
    orderBy,

    skip,
    take,
  });

  const totalCoupons = await database.coupon.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalCoupons} Coupons</h3>
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
                New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-screen-lg">
              <DialogHeader className="space-y-6">
                <DialogTitle>New Coupon</DialogTitle>
                <CouponForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CouponsList coupons={coupons} totalPayments={totalCoupons} />
    </div>
  );
};

export default page;
