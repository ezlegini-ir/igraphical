"use client";

import { Button } from "@igraph/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Textarea } from "@igraph/ui/components/ui/textarea";
import { walletFormSchema, WalletFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { Input } from "@igraph/ui/components/ui/input";
import { useEffect, useState } from "react";
import { getWalletByUserId } from "@/data/wallet";
import { Wallet } from "@igraph/database";
import { Badge } from "@igraph/ui/components/ui/badge";
import { formatPrice } from "@igraph/utils";
import { toast } from "sonner";
import { updateWallet } from "@/actions/wallet";
import { useLoading } from "@igraph/utils";
import { useRouter } from "next/navigation";
import Loader from "@igraph/ui/components/Loader";
import SearchUsers from "@/components/SearchUsers";

const WalletForm = () => {
  //HOOKS
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const { loading, setLoading } = useLoading();
  const router = useRouter();

  //CONSTS
  const form = useForm<WalletFormType>({
    resolver: zodResolver(walletFormSchema),
    defaultValues: {
      description: "کسر/شارژ کیف پول توسط مدیر وبسایت",
      amount: 0,
      type: "INCREMENT",
    },
  });
  const amount = form.watch("amount");
  const userId = form.watch("userId");
  const type = form.watch("type");

  const onSubmit = async (data: WalletFormType) => {
    setLoading(true);

    if (wallet && amount > wallet.balance && type === "DECREMENT") {
      toast.error(
        "Decrement Amount Should be equal or less than Wallet Balance"
      );
      setLoading(false);
      return;
    }

    if (userId && !wallet && type === "DECREMENT") {
      toast.error("User Has Yet No Wallet, you can not decrement balance.");
      setLoading(false);
      return;
    }

    const res = await updateWallet(data);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      setLoading(false);
      fetchWallet();
      router.refresh();
    }
  };

  const fetchWallet = async () => {
    if (!userId) return;
    const wallet = await getWalletByUserId(userId);
    setWallet(wallet);
  };

  useEffect(() => {
    fetchWallet();
  }, [userId]);

  return (
    <div className="col-span-12 lg:col-span-6 xl:col-span-3 card h-min">
      <h4 className="text-gray-600">Deposit/Withdraw</h4>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User</FormLabel>
                <FormControl>
                  <SearchUsers field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {userId !== undefined && wallet && (
            <Badge
              className="w-full p-3 justify-between text-sm"
              variant={"gray"}
            >
              Balance:
              <span>{formatPrice(wallet?.balance || 0)}</span>
            </Badge>
          )}

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
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INCREMENT">
                      <span className="text-green-500">Increment</span>
                    </SelectItem>
                    <SelectItem value="DECREMENT">
                      <span className="text-red-500">Decrement</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea dir="rtl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={loading || !form.formState.isValid}
            className="w-full"
            type="submit"
          >
            <Loader loading={loading} />
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default WalletForm;
