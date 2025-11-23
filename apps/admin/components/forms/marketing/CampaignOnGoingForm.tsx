"use client";

import {
  createOnGoingCampaign,
  deleteCampaignOnGoing,
  updateOnGoingCampaign,
} from "@/actions/campaign";
import {
  campaignOnGoingFormSchema,
  CampaignOnGoingFormType,
} from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CampaignOnGoing } from "@igraph/database";
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
import { cn, useLoading } from "@igraph/utils";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  type: "NEW" | "UPDATE";
  campaign?: CampaignOnGoing;
}

const CampaignForm = ({ type, campaign }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();

  const isUpdateType = type === "UPDATE";

  const form = useForm<CampaignOnGoingFormType>({
    resolver: zodResolver(campaignOnGoingFormSchema),
    mode: "onChange",
    defaultValues: {
      title: campaign?.title || "",
      date: {
        from: campaign?.startAt || new Date(),
        to: campaign?.endAt || addDays(new Date(), 3),
      },
    },
  });

  const onSubmit = async (data: CampaignOnGoingFormType) => {
    console.log(data);
    setLoading(true);

    const res = isUpdateType
      ? await updateOnGoingCampaign(data, campaign?.id!)
      : await createOnGoingCampaign(data);

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
    const res = await deleteCampaignOnGoing(campaign?.id!);

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

          {/* //! DATE RANGE */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col py-1">
                <FormLabel>Start / End</FormLabel>
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
