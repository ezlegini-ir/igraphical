"use client";

import { updateOverallOff } from "@/actions/overallOff";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { Switch } from "@igraph/ui/components/ui/switch";
import { cn } from "@igraph/utils";
import {
  OverallOffFormType,
  overallOffFormSchema,
} from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { OverallOff } from "@igraph/database";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  overallOff: OverallOff | null;
}

const OverallOffForm = ({ overallOff }: Props) => {
  // HOOKS
  const [activeDate, setActiveDate] = useState(
    !!overallOff?.from || !!overallOff?.to
  );
  const router = useRouter();

  const form = useForm<OverallOffFormType>({
    resolver: zodResolver(overallOffFormSchema),
    mode: "onSubmit",
    defaultValues: {
      amount: overallOff?.amount || 0,
      type: overallOff?.type || "FIXED_ON_CART",
      active: overallOff?.active,
      date: activeDate
        ? {
            from: overallOff?.from || new Date(),
            to: overallOff?.to || new Date(),
          }
        : undefined,
    },
  });

  const onSubmit = async (data: OverallOffFormType) => {
    const res = await updateOverallOff(data, overallOff?.id || 0);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  useEffect(() => {
    if (activeDate) {
      form.setValue("date", {
        from: overallOff?.from || new Date(),
        to: overallOff?.to || addDays(new Date(), 4),
      });
    } else {
      form.setValue("date", undefined);
    }
  }, [activeDate, overallOff, form]);

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active Overall Off</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div
          className={`space-y-5 ${!form.watch("active") && "pointer-events-none opacity-50"}`}
        >
          {/* //! AMOUNT */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    min={0}
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! TYPE */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Discount Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FIXED">
                      <div className="flex items-center gap-1 font-medium">
                        <span className="text-xl pr-1 text-primary">$</span>{" "}
                        Fixed
                      </div>
                    </SelectItem>
                    <SelectItem value="PERCENT">
                      <div className="flex items-center gap-1 font-medium">
                        <span className="text-xl pr-1 text-orange-500">%</span>{" "}
                        Percent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* //! DATE RANGE */}
          <div className="flex gap-2 items-center">
            <Switch checked={activeDate} onCheckedChange={setActiveDate} />
            <span className="text-sm">Active Date</span>
          </div>

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col py-1">
                <FormLabel>From / To</FormLabel>
                <Popover>
                  <PopoverTrigger asChild disabled={!activeDate}>
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
        </div>
        <Button
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className="w-full flex gap-2"
          type="submit"
        >
          {<Loader loading={form.formState.isSubmitting} />}
          Save
        </Button>
      </form>
    </Form>
  );
};

export default OverallOffForm;
