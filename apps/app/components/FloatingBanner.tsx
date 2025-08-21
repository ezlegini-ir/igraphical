"use client";

import { placeHolder } from "@/public";
import {
  Coupon,
  Image as ImageType,
  FloatingBanner as MyFloatingBanner,
} from "@igraph/database";
import { Button } from "@igraph/ui/components/ui/button";
import { Copy, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FloatingBannerType extends MyFloatingBanner {
  image: ImageType | null;
  coupon: Coupon | null;
}

interface Props {
  floatingBanner: FloatingBannerType | null;
}

const FloatingBanner = ({ floatingBanner }: Props) => {
  if (!floatingBanner) return;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem("floatingBannerDismissedAt");

    if (!dismissedAt) {
      setVisible(true);
      return;
    }

    const lastDismissed = new Date(dismissedAt);
    const now = new Date();

    const diffHours =
      (now.getTime() - lastDismissed.getTime()) / (1000 * 60 * 60);

    if (diffHours >= 24) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("floatingBannerDismissedAt", new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  const image = (
    <Image
      src={floatingBanner.image?.url || placeHolder}
      alt="Floating Banner"
      width={600}
      height={400}
      className="w-[375px] h-[3/2] object-cover"
    />
  );

  const remainingCoupon =
    (floatingBanner.coupon?.limit || 0) - (floatingBanner.coupon?.used || 0);

  const limit = floatingBanner.coupon?.limit || 0;
  const used = floatingBanner.coupon?.used || 0;

  const handleCopy = () => {
    if (floatingBanner.coupon?.code) {
      navigator.clipboard.writeText(floatingBanner.coupon.code);
    }
    toast.success("کد تخفیف کپی شد!");
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 space-y-1">
      <div className="relative bg-muted shadow-lg rounded-xl overflow-hidden">
        <Button
          onClick={handleClose}
          size={"icon"}
          variant={"ghost"}
          className="absolute top-2 right-2 rounded-full w-5 h-5 "
        >
          <X />
        </Button>

        {floatingBanner.link ? (
          <Link
            href={floatingBanner.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {image}
          </Link>
        ) : (
          image
        )}
      </div>
      <div className="space-y-1">
        <Button
          onClick={handleCopy}
          variant={"outline"}
          className="w-full gap-2 p-1.5 jb text-sm font-medium"
        >
          <span className="flex gap-2">
            <Copy size={15} />
            کد تخفیف:
          </span>
          <span>{floatingBanner.coupon?.code}</span>
        </Button>

        {floatingBanner.coupon?.limit && (
          <Button
            variant={"outline"}
            className="w-full flex gap-3 p-1.5 jb text-sm font-medium cursor-default items-center"
          >
            <div className="flex justify-center">
              <span className="flex gap-1">
                <span>باقی مانده:</span>
                <span className="text-blue-500">{remainingCoupon}</span>
              </span>
            </div>
            <div dir="ltr" className="flex gap-2 justify-between w-full">
              {Array.from({ length: limit }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-full rounded ${
                    i < used ? "bg-blue-500" : "bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default FloatingBanner;
