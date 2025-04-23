"use client";

import { Button } from "@igraph/ui/components/ui/button";
import { Calendar } from "@igraph/ui/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@igraph/ui/components/ui/popover";
import { cn } from "@igraph/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

const DateField = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <FormField
      control={form.control}
      name="enrolledAt"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <FormLabel>Enrollment Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal en-digits",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                className="en-digits"
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateField;
