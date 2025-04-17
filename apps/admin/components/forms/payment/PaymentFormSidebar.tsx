"use client";

import { Button } from "@igraph/ui/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@igraph/ui/components/ui/select";
import { Separator } from "@igraph/ui/components/ui/separator";
import { EnrollmentFormType, paymentStatus } from "@/lib/validationSchema";

import { deletePayment } from "@/actions/payment";
import DeleteButton from "@igraph/ui/components/DeleteButton";
import Loader from "@igraph/ui/components/Loader";
import { Badge } from "@igraph/ui/components/ui/badge";
import { getCouponByCode } from "@/data/coupon";
import { useLoading } from "@igraph/utils";
import { formatPrice } from "@igraph/utils";
import { Coupon, CouponType, User, Wallet } from "@igraph/database";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { CourseType, PaymentType } from "./PaymentForm";
import { Switch } from "@igraph/ui/components/ui/switch";
import { cashBackCalculator } from "@igraph/utils";

export interface priceType {
  price: number;
  originalPrice: number;
}

interface Props {
  form: UseFormReturn<EnrollmentFormType>;
  type: "NEW" | "UPDATE";
  prices: priceType[];
  setPrices: Dispatch<SetStateAction<priceType[]>>;
  selectedUser: User | undefined;
  selectedCourses: CourseType[];
  payment?: PaymentType;
  wallet?: Wallet;
}

const PaymentFormSidebar = ({
  form,
  type,
  selectedUser,
  prices,
  selectedCourses,
  wallet,
  payment,
  setPrices,
}: Props) => {
  // HOOKS
  const { loading: applyDiscountLoading, setLoading: setApplyDiscountLoading } =
    useLoading();
  const router = useRouter();
  const [coupon, setCoupon] = useState<Coupon>();

  // CONSTS
  const { setValue, watch } = form;
  const isUpdateType = type === "UPDATE";
  const form_Total = watch("payment.total");
  const form_ItemsTotal = watch("payment.itemsTotal");
  const form_DiscountAmount = watch("payment.discountAmount");
  const form_CouponCode = watch("payment.discountCode");
  const form_CouponCodeAmount = watch("payment.discountCodeAmount");
  const walletBalance = wallet?.balance || 0;
  const useWallet = watch("payment.usedWallet");
  const usedWalletAmount = watch("payment.usedWalletAmount") || 0;
  const initialCartTotal =
    selectedCourses.reduce((acc, curr) => acc + curr.price, 0) || 0;

  //! EFFECTS ------------------------
  useEffect(() => {
    const recalcTotals = () => {
      const itemsTotal = prices.reduce(
        (acc, curr) => acc + curr.originalPrice,
        0
      );
      setValue("payment.itemsTotal", itemsTotal);

      const total = prices.reduce((acc, curr) => acc + curr.price, 0);
      setValue("payment.total", total);

      const discount = itemsTotal - form_Total - usedWalletAmount;
      setValue("payment.discountAmount", discount);

      let computedTotal = total;

      if (coupon) {
        computedTotal = initialCartTotal - form_CouponCodeAmount;
      }

      if (useWallet) {
        const walletUsed = Math.min(walletBalance, computedTotal);
        setValue("payment.usedWalletAmount", walletUsed);
        computedTotal -= walletUsed;
      } else {
        setValue("payment.usedWalletAmount", 0);
      }

      setValue("payment.total", computedTotal);
    };

    recalcTotals();
  }, [
    prices,
    form_Total,
    useWallet,
    walletBalance,
    form_CouponCodeAmount,
    usedWalletAmount,
  ]);

  //! APPLY DISCOUNT  ---------------------------
  const applyDiscount = async () => {
    // REMOVE DISCOUNT CODE if already applied
    if (coupon) {
      setPrices((prev) =>
        prev?.map((item, index) => ({
          ...item,
          price: selectedCourses[index].price,
        }))
      );

      setCoupon(undefined);
      setValue("payment.total", form_Total + form_CouponCodeAmount);
      setValue("payment.discountCodeAmount", 0);

      toast.warning("Coupon Removed.");

      if (useWallet && usedWalletAmount > 0) {
        const usedWalletAmount = Math.min(form_Total, walletBalance);
        setValue("payment.usedWalletAmount", usedWalletAmount);
        setValue("payment.total", form_Total - usedWalletAmount);
      }

      return;
    }

    setApplyDiscountLoading(true);

    // COUPON CHECK ---------------
    const existingCoupon = await getCouponByCode(form_CouponCode);
    if (!existingCoupon) {
      toast.error("Invalid Coupon Code.");
      setApplyDiscountLoading(false);
      return;
    }

    // Handler Fn
    function applyDiscountAmount(type: CouponType) {
      if (!existingCoupon) return;
      setCoupon(existingCoupon);

      switch (type) {
        case "PERCENT": {
          const discountFactor = existingCoupon.amount / 100;
          const discountValue = form_Total * discountFactor;
          setValue("payment.discountCodeAmount", discountValue);
          setPrices(
            prices.map((item) => ({
              ...item,
              price: item.price * (1 - discountFactor),
            }))
          );

          break;
        }
        case "FIXED_ON_CART": {
          const existingCouponValue = existingCoupon.amount;

          if (existingCouponValue >= form_Total) {
            setValue("payment.discountCodeAmount", form_Total);
            setValue("payment.total", 0);
            setPrices(prices.map((item) => ({ ...item, price: 0 })));
          } else {
            const totalCart = prices.reduce((acc, item) => acc + item.price, 0);
            const updatedPrices = prices.map((item) => {
              const reduction = (item.price / totalCart) * existingCouponValue;
              return {
                ...item,
                price: Math.max(0, item.price - reduction),
              };
            });
            setValue("payment.discountCodeAmount", existingCouponValue);

            setPrices(updatedPrices);
          }
          break;
        }
        case "FIXED_ON_COURSE": {
          const discountFactor = existingCoupon.amount;
          setValue(
            "payment.discountCodeAmount",
            Math.min(form_Total, discountFactor * prices.length)
          );

          setPrices(
            prices.map((item) => ({
              ...item,
              price: Math.max(0, item.price - discountFactor),
            }))
          );

          break;
        }
      }
    }

    // DATE CHECK ---------------
    if (existingCoupon.to) {
      const isExpired = existingCoupon.to < new Date();
      if (isExpired) {
        toast.error("این کد تخفیف منقضی شده است.");
        setApplyDiscountLoading(false);
        return;
      }
    }
    if (existingCoupon.from) {
      const isNotStarted = existingCoupon.from > new Date();
      if (isNotStarted) {
        toast.error("زمان این کد تخفیف شروع نشده است.");
        setApplyDiscountLoading(false);
        return;
      }
    }

    // LIMIT CHECK ---------------
    if (existingCoupon.limit) {
      const isReachedToLimit = existingCoupon.used === existingCoupon.limit;
      if (isReachedToLimit) {
        toast.error("این کد تخفیف به سقف مجاز استفاده رسیده است");
        setApplyDiscountLoading(false);
        return;
      }
    }

    // COURSE INCLUDE/EXCLUDE CHECK ---------------
    if (
      existingCoupon.courseInclude.length > 0 ||
      existingCoupon.courseExclude.length > 0
    ) {
      //* COURSE INCLUDE CHECK
      if (existingCoupon.courseInclude.length > 0) {
        const courseIncludeIds = existingCoupon.courseInclude.map((c) => c.id);
        const coursesIds = selectedCourses?.map((c) => c.id);
        const isValid = coursesIds?.some((id) => courseIncludeIds.includes(id));

        if (!isValid) {
          toast.error("این کد تخفیف برای این دوره (ها) مجاز نمی باشد.");
          setApplyDiscountLoading(false);
          return;
        }

        applyDiscountAmount(existingCoupon.type);
      }

      //* COURSE EXCLUDE CHECK
      if (existingCoupon.courseExclude.length > 0) {
        const courseExcludeIds = existingCoupon.courseExclude.map((c) => c.id);
        const coursesIds = selectedCourses?.map((c) => c.id);
        const isNotValid = coursesIds?.some((id) =>
          courseExcludeIds.includes(id)
        );

        if (isNotValid) {
          toast.error("این کد تخفیف برای حداقل یکی از دوره ها مجاز نمی باشد.");
          setApplyDiscountLoading(false);
          return;
        }

        applyDiscountAmount(existingCoupon.type);
      }
    } else {
      applyDiscountAmount(existingCoupon.type);
    }

    setApplyDiscountLoading(false);
    toast.success("کد تخفیف با موفقیت اعمال شد.");
  };

  //!REMOVE PAYMENT -------------------
  const onDelete = async () => {
    const res = await deletePayment(payment?.id!);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.push("/enrollments/payments");
    }
  };

  return (
    <div className="card w-full col-span-12 lg:col-span-6 xl:col-span-3 h-min space-y-6">
      {/* //! Payment Status */}
      <FormField
        control={form.control}
        name="payment.status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status for payment" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {paymentStatus.map((status, index) => (
                  <SelectItem key={index} value={status}>
                    <span
                      className={`capitalize font-medium ${
                        status === "SUCCESS"
                          ? "text-green-600"
                          : status === "PENDING"
                            ? "text-yellow-500"
                            : status === "CANCELED"
                              ? "text-gray-500"
                              : "text-red-500"
                      }`}
                    >
                      {status.toLocaleLowerCase()}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            {/* //! Discount Code */}
            <FormField
              control={form.control}
              name="payment.discountCode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Discount Code</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={!!coupon || isUpdateType || !form_ItemsTotal}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isUpdateType && (
              <Button type="button" onClick={applyDiscount} variant={"outline"}>
                <Loader loading={applyDiscountLoading} />
                {coupon ? "Delete" : "Apply"}
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* //! Info */}
        <ul className="space-y-4 text-sm">
          {selectedUser && (
            <>
              <li className="flex justify-between">
                <span className="font-medium">User</span>
                <span className="text-gray-500">{selectedUser.fullName}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Phone</span>
                <span className="text-gray-500">{selectedUser.phone}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Email</span>
                <span className="text-gray-500">
                  {selectedUser.email.toLowerCase()}
                </span>
              </li>
              {!isUpdateType && (
                <Badge
                  variant={useWallet ? "blue" : "gray"}
                  className={`flex justify-between items-center text-sm font-medium py-3 hover:bg-slate-50 
            ${
              form_Total === 0 &&
              coupon &&
              !usedWalletAmount &&
              "pointer-events-none opacity-50"
            }
            `}
                >
                  <div className="flex flex-col gap-1">
                    <span>Use Wallet</span>
                    <span className="text-xs">
                      Balance: {formatPrice(walletBalance)}
                    </span>
                  </div>

                  <Switch
                    checked={useWallet}
                    onCheckedChange={(checked: boolean) =>
                      setValue("payment.usedWallet", checked)
                    }
                  />
                </Badge>
              )}
              <Separator />
            </>
          )}

          <li className="flex justify-between font-semibold">
            <span>Items Totals</span>
            <span>{formatPrice(form.watch("payment.itemsTotal"))}</span>
          </li>

          <li className="flex justify-between text-gray-500">
            <span className="font-medium">Wallet Reduction</span>
            <span>{formatPrice(usedWalletAmount)}</span>
          </li>

          <li className="flex justify-between text-gray-500">
            <span className="font-medium">Discount Code</span>
            <span>{formatPrice(form_CouponCodeAmount)}</span>
          </li>

          <li className="flex justify-between text-gray-500">
            <span className="font-medium">Fix Discount</span>
            <span>
              {formatPrice(form_DiscountAmount - form_CouponCodeAmount)}
            </span>
          </li>

          <li
            className={`flex justify-between text-gray-500 ${form_DiscountAmount && "text-green-600"}`}
          >
            <span className={`font-medium `}>Total Discount</span>
            <span>{formatPrice(form.watch("payment.discountAmount"))}</span>
          </li>
          <Separator />
          {!isUpdateType && (
            <li className="flex justify-between">
              <Badge
                className="w-full p-2 justify-between font-medium text-sm"
                variant={"green"}
              >
                Charge Waller{" "}
                {formatPrice(cashBackCalculator(form_Total), {
                  showNumber: true,
                })}
                <Switch
                  className="data-[state=checked]:bg-green-600"
                  defaultChecked={form.getValues("payment.chargeWallet")}
                  onCheckedChange={(checked: boolean) =>
                    setValue("payment.chargeWallet", checked)
                  }
                />
              </Badge>
            </li>
          )}
          <li>
            <Badge
              variant={
                isUpdateType && payment?.status === "SUCCESS" ? "green" : "blue"
              }
              className="flex justify-between py-3 text-sm"
            >
              <span className="font-semibold">
                {isUpdateType && payment?.status === "SUCCESS"
                  ? "Paid:"
                  : "Payable:"}
              </span>
              <span className="font-semibold">
                {formatPrice(form.watch("payment.total"), { showNumber: true })}
              </span>
            </Badge>
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <Button
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className="w-full"
        >
          <Loader loading={form.formState.isSubmitting} />
          {isUpdateType ? "Update" : "Create"}
        </Button>
        {isUpdateType && (
          <DeleteButton
            onDelete={onDelete}
            disabled={form.formState.isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentFormSidebar;
