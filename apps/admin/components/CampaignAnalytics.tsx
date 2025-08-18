"use client";

import Loader from "@igraph/ui/components/Loader";
import { Badge } from "@igraph/ui/components/ui/badge";
import { Progress } from "@igraph/ui/components/ui/progress";
import { Textarea } from "@igraph/ui/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@igraph/ui/components/ui/tooltip";
import { Separator } from "@igraph/ui/components/ui/separator";
import { formatPrice } from "@igraph/utils";
import { addMinutes, formatDate, formatDistance, isAfter } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateCampaignDeliveredCount } from "@/actions/campaign";
import { CampaignType } from "./forms/marketing/CampaignForm";

interface Props {
  campaign: CampaignType;
  isReady: boolean;
  conversionRate: number;
}

const CampaignAnalytics = ({ campaign, isReady, conversionRate }: Props) => {
  const [deliveredMessagesCount, setDeliveredMessagesCount] = useState<
    number | null
  >(campaign.messageDelivered);
  const [loadingDelivered, setLoadingDelivered] = useState(false);
  const router = useRouter();

  const sold =
    campaign.coupon?.payment.reduce((acc, curr) => acc + curr.total, 0) ?? 0;
  const goalPercent = (sold / (campaign.sellGoal || 0)) * 100;

  const campaignCost =
    campaign.campaignMessages.reduce((acc, curr) => acc + curr.smsCost, 0) / 10;

  useEffect(() => {
    const fetchDeliveredCount = async () => {
      if (!campaign.messageDelivered) {
        setLoadingDelivered(true);
        const result = await updateCampaignDeliveredCount(campaign.id);
        setDeliveredMessagesCount(result.deliveredCount);
        setLoadingDelivered(false);
        router.refresh();
      }
    };

    if (isAfter(new Date(), addMinutes(campaign.createdAt, 5))) {
      fetchDeliveredCount();
    }
  }, [campaign.id, campaign.messageDelivered, campaign.createdAt, router]);

  const renderDeliveredValue = () => {
    if (loadingDelivered) {
      return (
        <div className="flex gap-1 items-center text-xs text-slate-400">
          <Loader className="text-slate-300" />
          Loading...
        </div>
      );
    }

    if (!isReady) {
      return (
        <div className="flex gap-1 items-center text-xs text-slate-400">
          <Loader className="text-slate-300" />
          Wait {formatDistance(addMinutes(campaign.createdAt, 5), new Date())}
        </div>
      );
    }

    return deliveredMessagesCount;
  };

  const campaignData = [
    { title: "Coupon:", value: campaign.coupon?.code },
    { title: "URL:", value: campaign.url },
    { title: "Start Date:", value: formatDate(campaign.startAt, "yyyy/MM/dd") },
    { title: "End Date:", value: formatDate(campaign.endAt, "yyyy/MM/dd") },
  ];

  const sellData = [
    {
      title: "Sent Messages:",
      value: campaign.messageSent.toLocaleString("en-US"),
    },
    { title: "Delivered Messages:", value: renderDeliveredValue() },
    { title: "Link Opened:", value: 3 }, // TODO
  ];

  return (
    <div className="space-y-8">
      {/* Goal & Stats */}
      <div>
        <Badge
          variant={goalPercent === 100 ? "green" : "gray"}
          className="block hover:bg-gray-50 text-sm font-medium p-3 w-full rounded-bl-none rounded-br-none border-b-transparent "
        >
          <div className="flex justify-between text-muted-foreground">
            <p>Sell Goal:</p>
            <p>{formatPrice(campaign.sellGoal)}</p>
          </div>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <Progress className="h-3" value={goalPercent} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{goalPercent.toFixed()}%</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex justify-between text-red-500">
            <p>Cost:</p>
            <p>{formatPrice(campaignCost)}</p>
          </div>
          <div className="flex justify-between text-green-500">
            <p>Sold:</p>
            <p>{formatPrice(sold)}</p>
          </div>
          <Separator />
          <div className="flex justify-between text-primary">
            <p>Net Sold:</p>
            <p>{formatPrice(sold - campaignCost)}</p>
          </div>
        </Badge>
        <Badge
          className="w-full p-3 flex justify-between text-sm rounded-tl-none rounded-tr-none "
          variant="blue"
        >
          <span>Conversion Rate:</span>
          <span>% {conversionRate.toFixed()}</span>
        </Badge>
      </div>

      {/* Message */}
      <div>
        <h6 className="text-sm font-medium">Message</h6>
        <Textarea dir="rtl" defaultValue={campaign.message} disabled />
      </div>

      {/* Campaign Info */}
      <div>
        <h6 className="text-sm font-medium">Campaign Info</h6>
        <ul className="rounded-md overflow-hidden">
          {campaignData.map((data, idx) => (
            <li
              key={idx}
              className="flex justify-between py-3 px-3 odd:bg-slate-100 text-sm"
            >
              <span>{data.title}</span>
              <span>{data.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Sell Info */}
      <div>
        <h6 className="text-sm font-medium">Campaign Sell Info</h6>
        <ul className="rounded-md overflow-hidden">
          {sellData.map((data, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center py-3 px-3 odd:bg-slate-100 text-sm"
            >
              <span>{data.title}</span>
              <span>{data.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CampaignAnalytics;
