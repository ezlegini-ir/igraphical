import FloatingBannerForm from "@/components/forms/announcement/FloatingBannerForm";
import { database } from "@igraph/database";

const page = async () => {
  const floatingBanner = await database.floatingBanner.findFirst({
    include: {
      image: true,
      coupon: true,
    },
  });

  return (
    <div className="max-w-screen-sm">
      <FloatingBannerForm floatingBanner={floatingBanner} />
    </div>
  );
};

export default page;
