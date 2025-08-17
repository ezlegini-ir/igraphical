"use client";

import { createCampaign } from "@/actions/campaign";
import { deleteCoupon } from "@/actions/coupon";
import SearchCoupons from "@/components/SearchCoupons";
import { campaignFormSchema, CampaignFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Campaign, CampaignMessages, Coupon, Payment } from "@igraph/database";
import DeleteButton from "@igraph/ui/components/DeleteButton";
import Loader from "@igraph/ui/components/Loader";
import { Button } from "@igraph/ui/components/ui/button";
import { Calendar } from "@igraph/ui/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@igraph/ui/components/ui/popover";
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { cn, useLoading } from "@igraph/utils";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface CampaignType extends Campaign {
  coupon: (Coupon & { payment: Payment[] }) | null;
  CampaignMessages: CampaignMessages[];
}

interface Props {
  type: "NEW" | "UPDATE";
  coupon?: CampaignType;
}

const CampaignForm = ({ type, coupon: campaign }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();

  const isUpdateType = type === "UPDATE";

  const form = useForm<CampaignFormType>({
    resolver: zodResolver(campaignFormSchema),
    mode: "onChange",
    defaultValues: {
      couponId: campaign?.couponId || 0,
      sellGoal: campaign?.sellGoal || 0,
      title: campaign?.title || "",
      url: campaign?.url || "",
      message: campaign?.message || "",
      date: {
        from: campaign?.startAt || new Date(),
        to: campaign?.endAt || addDays(new Date(), 10),
      },
    },
  });

  const onSubmit = async (data: CampaignFormType) => {
    setLoading(true);

    console.log(data);

    const res = await createCampaign(data);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
      setLoading(false);
    }
  };

  const onDelete = async () => {
    const res = await deleteCoupon(campaign?.id!);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          {/* //! TITLE */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! URL */}
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! SELL GOAL */}
          <FormField
            control={form.control}
            name={"sellGoal"}
            render={({ field }) => (
              <FormItem
                className={`w-full ${isUpdateType && "pointer-events-none"}`}
              >
                <FormLabel>Sell Goal (T) - (Optional)</FormLabel>
                <Input
                  min={0}
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? 0 : Number(value));
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! COUPON */}
          <FormField
            control={form.control}
            name={"couponId"}
            render={({ field }) => (
              <FormItem
                className={`w-full ${isUpdateType && "pointer-events-none"}`}
              >
                <FormLabel>Coupon</FormLabel>
                <SearchCoupons field={field} code={campaign?.coupon?.code} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! MESSAGE */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea dir="rtl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! DATE RANGE */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col py-1">
                <FormLabel>From / To</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          <div className="flex gap-1">
                            {format(field.value.from || new Date(), "MMMM dd")}
                            <span>-</span>
                            {format(
                              field.value.to || addDays(new Date(), 3),
                              "MMMM dd"
                            )}
                          </div>
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 en-digits"
                    align="start"
                  >
                    <Calendar
                      mode="range"
                      selected={field.value as DateRange}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={!form.formState.isValid || loading}
            className="w-full flex gap-2"
            type="submit"
          >
            {<Loader loading={loading} />}
            {isUpdateType ? "Update" : "Create"}
          </Button>
          {isUpdateType && <DeleteButton onDelete={onDelete} />}
        </div>
      </form>
    </Form>
  );
};

export default CampaignForm;
