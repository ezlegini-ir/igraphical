"use client";

import {
  createQuickPayment,
  QuickPaymentDataType,
} from "@/actions/quickPayment";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import Loader from "@igraph/ui/components/Loader";
import { Separator } from "@igraph/ui/components/ui/separator";
import { getCouponByCode } from "@/data/coupon";
import { getSessionUser } from "@/data/user";
import { useLoading } from "@igraph/utils";
import { formatPriceBy3Digits } from "@igraph/utils";
import { discountFormSchema, DiscountFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coupon, CouponType, Course, Discount, Wallet } from "@igraph/database";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CashBackCard from "@igraph/ui/components/CashBackCard";
import { Badge } from "@igraph/ui/components/ui/badge";
import { Switch } from "@igraph/ui/components/ui/switch";

export interface CourseType extends Course {
  discount: Discount | null;
}

interface Props {
  course: CourseType;
  wallet: Wallet | null;
}

const QuickCartCheckoutForm = ({ course, wallet }: Props) => {
  // HOOKS ---------------------------
  const [initialCartTotal] = useState(course.price);
  const [cartTotal, setCartTotal] = useState(course.price);
  const [usedWalletAmount, setUsedWalletAmount] = useState(0);
  const [useWallet, setUseWallet] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<Coupon | undefined>(undefined);
  const [couponAmount, setCouponAmount] = useState(0);
  const { loading: applyDiscountLoading, setLoading: setApplyDiscountLoading } =
    useLoading();
  const { loading, setLoading } = useLoading();

  // CONSTS ---------------------------
  const walletBalance = wallet?.balance || 0;
  const form = useForm<DiscountFormType>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: { code: "" },
  });
  const discountAmount = course.discount
    ? course.discount?.type === "FIXED"
      ? course.discount?.amount
      : (course.discount?.amount / 100) * course.basePrice
    : 0;
  const form_DiscountCode = form.watch("code");

  // EFFECTS ---------------------------
  useEffect(() => {
    // enable
    if (useWallet) {
      if (coupon) {
        // Coupon Exists
        const usedWalletAmount = Math.min(
          walletBalance,
          initialCartTotal - couponAmount
        );
        setUsedWalletAmount(usedWalletAmount);
        setCartTotal(initialCartTotal - couponAmount - usedWalletAmount);
      } else {
        // Coupon Not Exists
        const usedWalletAmount = Math.min(initialCartTotal, walletBalance);
        setUsedWalletAmount(usedWalletAmount);
        setCartTotal(initialCartTotal - usedWalletAmount);
      }
    } else {
      setUsedWalletAmount(0);
      setCartTotal((prev) => prev + usedWalletAmount);
    }
    // disable
  }, [useWallet]);

  //! APPLY DISCOUNT  ---------------------------
  const applyDiscount = async () => {
    // REMOVE DISCOUNT CODE if already applied
    if (coupon) {
      setCoupon(undefined);
      setCartTotal((prev) => prev + couponAmount);
      setCouponAmount(0);
      form.reset();

      toast.warning("کد تخفیف حذف شد");
      if (useWallet && usedWalletAmount > 0) {
        const usedWalletAmount = Math.min(initialCartTotal, walletBalance);
        setUsedWalletAmount(usedWalletAmount);
        setCartTotal(initialCartTotal - usedWalletAmount);
      }

      return;
    }

    setApplyDiscountLoading(true);

    // COUPON CHECK ---------------
    const existingCoupon = await getCouponByCode(form_DiscountCode);
    if (!existingCoupon) {
      toast.error("کد تخفیف نا معتبر می باشد!");
      setApplyDiscountLoading(false);
      return;
    }

    function applyDiscountAmount(type: CouponType) {
      if (!existingCoupon) return;
      setCoupon(existingCoupon);

      if (type === "FIXED_ON_CART" || type === "FIXED_ON_COURSE") {
        const discountValue = existingCoupon.amount;
        const isNegativePrice = cartTotal - discountValue <= 0;
        const finalDiscount = isNegativePrice
          ? useWallet
            ? initialCartTotal - (wallet?.balance || 0)
            : initialCartTotal
          : discountValue;
        setCouponAmount(finalDiscount);
        setCartTotal((prev) => Math.max(0, prev - discountValue));
      } else {
        const discountValue = initialCartTotal * (existingCoupon.amount / 100);
        setCouponAmount(discountValue);
        setCartTotal((prev) => prev - discountValue);
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
      // COURSE INCLUDE CHECK
      if (existingCoupon.courseInclude.length > 0) {
        const courseIncludeIds = existingCoupon.courseInclude.map((c) => c.id);
        if (!courseIncludeIds.includes(course.id)) {
          toast.error("این کد تخفیف برای این دوره مجاز نمی باشد");
          setApplyDiscountLoading(false);
          return;
        }
        applyDiscountAmount(existingCoupon.type);
      }

      // COURSE EXCLUDE CHECK
      if (existingCoupon.courseExclude.length > 0) {
        const courseExcludeIds = existingCoupon.courseExclude.map((c) => c.id);
        if (courseExcludeIds.includes(course.id)) {
          toast.error("این کد تخفیف برای این دوره مجاز نمی باشد");
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

  //! ON SUBMIT  ---------------------------
  const onPayment = async () => {
    const user = await getSessionUser();
    setLoading(true);
    if (!user) return;

    const data: QuickPaymentDataType = {
      amount: cartTotal,
      courseId: course.id,
      user,
      itemsTotal: course.basePrice,
      discountAmount: couponAmount + (course.discount?.amount || 0) || 0,
      discountCode: coupon?.code,
      discountCodeAmount: couponAmount,
      useWallet,
      useWalletAmount: useWallet ? usedWalletAmount : undefined,
    };

    const res = await createQuickPayment(data);
    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }
    if (res.success && res.paymentUrl) {
      toast.success(res.success);
      redirect(res.paymentUrl);
    }
    if (res.success && res.redirectUrl) {
      toast.success(res.success);
      redirect(res.redirectUrl);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex text-nowrap items-center gap-2 text-sm font-medium">
          <span>قیمت دوره</span>
          <div className="w-full">
            <Separator />
          </div>
          <div>
            {formatPriceBy3Digits(course.basePrice)}
            <span className="text-gray-500 text-xs mr-1">تومان</span>
          </div>
        </div>

        {discountAmount > 0 && (
          <div className="flex text-nowrap items-center gap-2 text-sm text-slate-400">
            <span>تخفیف دوره</span>
            <div className="w-full">
              <Separator />
            </div>
            <div>
              {formatPriceBy3Digits(discountAmount)}-{" "}
              <span className="text-xs">تومان</span>
            </div>
          </div>
        )}

        {couponAmount > 0 && (
          <div className="flex text-nowrap items-center gap-2 text-sm text-slate-400">
            <span>کسر کد تخفیف</span>
            <div className="w-full">
              <Separator />
            </div>
            <div>
              {formatPriceBy3Digits(couponAmount)}-{" "}
              <span className="text-xs">تومان</span>
            </div>
          </div>
        )}

        {usedWalletAmount > 0 && (
          <div className="flex text-nowrap items-center gap-2 text-sm text-slate-400">
            <span>کسر کیف پول</span>
            <div className="w-full">
              <Separator />
            </div>
            <div>
              {formatPriceBy3Digits(usedWalletAmount)}-{" "}
              <span className="text-xs">تومان</span>
            </div>
          </div>
        )}

        {/* //! PURCHASE BUTTON */}
        <div className="space-y-3">
          <Button disabled={loading} className="w-full" onClick={onPayment}>
            <Loader loading={loading} />
            {loading ? (
              "در حال انتقال"
            ) : cartTotal > 0 ? (
              <span className="flex">
                پرداخت {formatPriceBy3Digits(cartTotal)} تومان
              </span>
            ) : (
              <span className="flex">تکمیل ثبت نام</span>
            )}
          </Button>

          <CashBackCard price={cartTotal} />
        </div>
      </div>

      {walletBalance > 0 && initialCartTotal !== 0 && (
        <Badge
          variant={useWallet ? "blue" : "gray"}
          className={`flex justify-between items-center text-sm font-medium py-3 hover:bg-slate-50 
            ${
              cartTotal === 0 &&
              coupon &&
              !usedWalletAmount &&
              "pointer-events-none opacity-50"
            }
            `}
        >
          <div className="flex flex-col gap-1">
            <span>استفاده از کیف پول</span>
            <span className="text-xs">
              موجودی: {formatPriceBy3Digits(walletBalance)} تومان
            </span>
          </div>

          <Switch
            dir="ltr"
            checked={useWallet}
            onCheckedChange={(checked: boolean) => setUseWallet(checked)}
          />
        </Badge>
      )}

      {/* //! DISCOUNT BUTTON */}
      <Form {...form}>
        <form className="relative" onSubmit={form.handleSubmit(applyDiscount)}>
          {initialCartTotal !== 0 && (
            <>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={!!coupon}
                        className="border-slate-300 relative pl-20 font-medium tracking-wide bg-white"
                        placeholder="کد تخفیف"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                disabled={!form.formState.isValid || applyDiscountLoading}
                className="absolute px-4 inset-y-0 h-7 left-1 my-auto text-black"
                type="submit"
                size={"sm"}
                variant={"secondary"}
              >
                <Loader loading={applyDiscountLoading} />
                {coupon ? (
                  <span className="flex gap-1">
                    <X />
                    حذف
                  </span>
                ) : applyDiscountLoading ? (
                  "در حال بررسی"
                ) : (
                  "بــررســی"
                )}
              </Button>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default QuickCartCheckoutForm;
