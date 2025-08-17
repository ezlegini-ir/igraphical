"use client";

import { getCouponByCode } from "@/data/coupon";
import { searchCoupons } from "@/data/search";
import { Coupon } from "@igraph/database";
import SearchField from "@igraph/ui/components/SearchField";
import { useEffect, useState } from "react";

const SearchCoupons = ({
  field,
  code,
  placeHolder = "Search Coupons...",
}: {
  field: any;
  code?: string;
  placeHolder?: string;
}) => {
  const [defaultCoupon, setDefaultCoupon] = useState<Coupon | undefined>(
    undefined
  );

  const fetchCoupons = async (query: string): Promise<Coupon[]> => {
    return await searchCoupons(query);
  };

  useEffect(() => {
    const fetchSelectedCoupon = async () => {
      if (code) {
        const coupon = await getCouponByCode(code);
        setDefaultCoupon(coupon || undefined);
      }
    };
    fetchSelectedCoupon();
  }, [code]);

  return (
    <SearchField<Coupon>
      placeholder={placeHolder}
      fetchResults={fetchCoupons}
      onSelect={(coupon) =>
        coupon ? field.onChange(coupon.id) : field.onChange(undefined)
      }
      getItemLabel={(coupon) => `${coupon.code}`}
      defaultItem={defaultCoupon}
    />
  );
};

export default SearchCoupons;
