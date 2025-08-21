import { unstable_cache } from "next/cache";
import { database } from "@igraph/database";

export const getFloatingBanner = unstable_cache(
  async () => {
    return await database.floatingBanner.findFirst({
      include: {
        image: true,
        coupon: true,
      },
    });
  },
  ["floating-banner"],
  { revalidate: 1800 }
);
