"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@igraph/ui/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@igraph/ui/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const searchSchema = z.object({
  search: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

const Search = ({
  placeholder = "Search...",
  className,
}: {
  placeholder?: string;
  className?: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: currentSearch },
  });

  const handleSubmit = (values: SearchFormValues) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (values.search) {
      params.set("search", values.search);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    form.setValue("search", currentSearch);
  }, [currentSearch, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="search"
          control={form.control}
          render={({ field }) => (
            <FormItem className={className}>
              <FormControl>
                <Input
                  placeholder={placeholder}
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      form.handleSubmit(handleSubmit)();
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default Search;
