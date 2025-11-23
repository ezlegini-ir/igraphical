"use client";

import { createPayment, PaymentDataType } from "@/actions/payment";
import { getCouponByCode } from "@/data/coupon";
import { getSessionUser } from "@/data/user";
import { paymentFormSchema, PaymentFormType } from "@/lib/validationSchema";
import { digipayLogo, zarrinpalLogo } from "@/public";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Coupon,
  CouponType,
  Course,
  Discount,
  PaymentMethod,
  Wallet,
} from "@igraph/database";
import CashBackCard from "@igraph/ui/components/CashBackCard";
import Loader from "@igraph/ui/components/Loader";
import { Badge } from "@igraph/ui/components/ui/badge";
import { Button } from "@igraph/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@igraph/ui/components/ui/form";
import { Input } from "@igraph/ui/components/ui/input";
import { Switch } from "@igraph/ui/components/ui/switch";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@igraph/ui/components/ui/toggle-group";
import { formatPriceBy3Digits, useLoading } from "@igraph/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { priceType } from "./Cart";
import CheckoutInfo from "./CheckoutInfo";
import { getCampaign } from "@/data/campaign";

interface Props {
  courses: CourseType[];
  wallet: Wallet | null;
  prices: priceType[];
  setPrices: Dispatch<SetStateAction<priceType[]>>;
}

interface CourseType extends Course {
  discount: Discount | null;
}

const CheckoutForm = ({ courses, wallet, prices, setPrices }: Props) => {
  // CONSTS ---------------------------
  const total = prices.reduce((acc, curr) => acc + curr.price, 0);
  const baseTotal = prices.reduce((acc, curr) => acc + curr.originalPrice, 0);
  const walletBalance = wallet?.balance || 0;
  const form = useForm<PaymentFormType>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: { code: "", paymentMethod: "ZARRIN_PAL" },
    mode: "onSubmit",
  });
  const discountAmount = baseTotal - total;
  const form_DiscountCode = form.watch("code");

  // HOOKS ---------------------------
  const [paymentMethod, setPaymentMethod] = useState(
    form.watch("paymentMethod")
  );
  const [initialCartTotal] = useState(total);
  const [cartTotal, setCartTotal] = useState(total);
  const [usedWalletAmount, setUsedWalletAmount] = useState(0);
  const [installmentProfitAmount, setInstallmentProfit] = useState(0);
  const [useWallet, setUseWallet] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<Coupon | undefined>(undefined);
  const [couponAmount, setCouponAmount] = useState(0);
  const { loading: applyDiscountLoading, setLoading: setApplyDiscountLoading } =
    useLoading();
  const { loading, setLoading } = useLoading();
  const loanRete = 0;
  const minimumValidLoanAmount = 650_000;
  const isFree = cartTotal === 0;

  //! EFFECTS -----------------------------
  useEffect(() => {
    if (useWallet) {
      setCartTotal(total - walletBalance);
    } else if (!useWallet) {
      setCartTotal(total);
    }
  }, [prices]);

  console.log(paymentMethod);

  useEffect(() => {
    console.log("first");
    if (paymentMethod === "DIGIPAY") {
      if (cartTotal <= minimumValidLoanAmount) {
        form.setValue("paymentMethod", "ZARRIN_PAL");
        setPaymentMethod("ZARRIN_PAL");
        toast.warning(
          `حداقل مبلغ سبد خرید برای استفاده از خرید اقساطی ${formatPriceBy3Digits(minimumValidLoanAmount)} تومان می باشد.`
        );
        return;
      }

      const installmentProfit = cartTotal * loanRete;
      setInstallmentProfit(installmentProfit);
      setCartTotal((pre) => pre + installmentProfit);
      // toast.info(
      //   `مبلغ سبد خرید ${formatPriceBy3Digits(installmentProfit)} تومان افزایش یافت.`
      // );
    }

    if (paymentMethod === "ZARRIN_PAL") {
      setCartTotal((pre) => pre - installmentProfitAmount);
      setInstallmentProfit(0);
    }
  }, [paymentMethod]);

  useEffect(() => {
    // enable
    if (useWallet) {
      if (coupon) {
        if (couponAmount === initialCartTotal && useWallet) {
          setUseWallet(false);
        }
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
      // disable
      setUsedWalletAmount(0);
      setCartTotal((prev) => prev + usedWalletAmount);
    }
  }, [useWallet, coupon]);

  //! PAYMENT METHOD
  const setPaymentMethodForm = (value: PaymentMethod) => {
    if (value === "ZARRIN_PAL") {
      setPaymentMethod("ZARRIN_PAL");
      form.setValue("paymentMethod", "ZARRIN_PAL");
    }

    if (value === "DIGIPAY") {
      setPaymentMethod("DIGIPAY");
      form.setValue("paymentMethod", "DIGIPAY");
    }
  };

  //! APPLY DISCOUNT  ---------------------------
  const applyDiscount = async () => {
    // Check if a campaign is going on
    const campaign = await getCampaign();

    if (campaign) {
      toast.warning(
        ` به علت جاری بودن کمپین ${campaign.title} امکان استفاده از کد تخفیف در این بازه وجود ندارد.`
      );
      return;
    }

    // REMOVE DISCOUNT CODE if already applied
    if (coupon) {
      setPrices((prev) =>
        prev.map((item, index) => ({
          ...item,
          price: courses[index]!.price,
        }))
      );

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

    // Handler Fn
    function applyDiscountAmount(type: CouponType) {
      if (!existingCoupon) return;
      setCoupon(existingCoupon);

      switch (type) {
        case "PERCENT": {
          const discountFactor = existingCoupon.amount / 100;

          if (
            existingCoupon.courseExclude.length > 0 ||
            existingCoupon.courseInclude.length > 0
          ) {
            if (existingCoupon.courseExclude.length > 0) {
              const excludedCoursesIds = new Set(
                existingCoupon.courseExclude.map((c) => c.id)
              );
              const coursesToBeReduced = courses
                .map((c) => c.id)
                .filter((id) => !excludedCoursesIds.has(id));
              const toReduceSet = new Set(coursesToBeReduced);

              // compute new prices first
              const newPrices = prices.map((item) =>
                toReduceSet.has(item.courseId)
                  ? {
                      ...item,
                      price: item.originalPrice * (1 - discountFactor),
                    }
                  : item
              );

              const discountValue =
                initialCartTotal -
                newPrices.reduce((acc, curr) => acc + curr.price, 0);

              // now update states separately
              setPrices(newPrices);
              setCouponAmount(discountValue);
            }

            if (existingCoupon.courseInclude.length > 0) {
            }
          } else {
            const discountValue = initialCartTotal * discountFactor;
            setCouponAmount(discountValue);

            setPrices((prev) =>
              prev.map((item) => ({
                ...item,
                price: item.price * (1 - discountFactor),
              }))
            );
          }

          break;
        }

        case "FIXED_ON_CART": {
          const discountValue = existingCoupon.amount;

          if (discountValue >= initialCartTotal) {
            setCouponAmount(initialCartTotal);
            setCartTotal(0);
            setPrices(prices.map((item) => ({ ...item, price: 0 })));
          } else {
            const totalCart = prices.reduce((acc, item) => acc + item.price, 0);
            const updatedPrices = prices.map((item) => {
              const reduction = (item.price / totalCart) * discountValue;
              return {
                ...item,
                price: Math.max(0, item.price - reduction),
              };
            });
            setCouponAmount(discountValue);
            const newTotal = updatedPrices.reduce(
              (acc, item) => acc + item.price,
              0
            );
            setCartTotal(newTotal);
            setPrices(updatedPrices);
          }
          break;
        }

        case "FIXED_ON_COURSE": {
          const discountFactor = existingCoupon.amount;
          setCouponAmount(Math.min(cartTotal, discountFactor * prices.length));

          setPrices((prev) =>
            prev.map((item) => ({
              ...item,
              price: Math.max(0, item.price - discountFactor),
            }))
          );

          break;
        }
        default:
          break;
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
        const coursesIds = courses.map((c) => c.id);
        const isValid = coursesIds.some((id) => courseIncludeIds.includes(id));

        if (!isValid) {
          toast.error("این کد تخفیف برای این دوره (ها) مجاز نمی باشد.");
          setApplyDiscountLoading(false);
          return;
        }

        applyDiscountAmount(existingCoupon.type);
      }

      //* COURSE EXCLUDE CHECK
      if (existingCoupon.courseExclude.length > 0) {
        const courseExcludeIds = existingCoupon.courseExclude
          .map((c) => c.id)
          .sort();
        const coursesIds = courses.map((c) => c.id).sort();
        const invalidAllCourses =
          coursesIds.length === courseExcludeIds.length &&
          coursesIds.every((val, idx) => val === courseExcludeIds[idx]);

        if (invalidAllCourses) {
          toast.error("این کد تخفیف برای این دوره ها مجاز نمی باشد.");
          setApplyDiscountLoading(false);
          return;
        }

        if (courses.length <= 1) {
          const isNotValid = coursesIds[0] === courseExcludeIds[0];

          if (isNotValid) {
            toast.error("این کد تخفیف برای این دوره مجاز نمی باشد.");
            setApplyDiscountLoading(false);
            return;
          }
        } else {
          applyDiscountAmount(existingCoupon.type);
        }
      }
    } else {
      applyDiscountAmount(existingCoupon.type);
    }

    setApplyDiscountLoading(false);
    toast.success("کد تخفیف با موفقیت اعمال شد.");
  };

  //! ON SUBMIT  ---------------------------
  const onPayment = async () => {
    setLoading(true);

    const user = await getSessionUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const discountAmount =
      couponAmount +
      courses.reduce((acc, curr) => acc + (curr.discount?.amount || 0), 0);
    const itemsTotal = courses.reduce((acc, curr) => acc + curr.basePrice, 0);
    const coursesIds = courses.map((c) => c.id);

    const data: PaymentDataType = {
      amount: cartTotal,
      coursesIds,
      user,
      itemsTotal,
      discountAmount,
      discountCode: coupon?.code,
      discountCodeAmount: couponAmount,
      useWallet,
      useWalletAmount: useWallet ? usedWalletAmount : undefined,
      prices,
      paymentMethod: paymentMethod ?? "NO_METHOD",
    };

    const res = await createPayment(data);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success && (res.paymentUrl || res.redirectUrl)) {
      const redirectTo = res.paymentUrl || res.redirectUrl;

      toast.success(res.success);
      redirect(redirectTo!);
    }
  };

  const totalPrice = courses.reduce((acc, curr) => acc + curr.price, 0);
  return (
    <div className="space-y-5">
      <CheckoutInfo
        baseTotal={baseTotal}
        cartTotal={cartTotal}
        couponAmount={couponAmount}
        discountAmount={discountAmount}
        totalPrice={totalPrice}
        usedWalletAmount={usedWalletAmount}
      />

      {walletBalance > 0 && (
        <Badge
          variant={useWallet ? "blue" : "gray"}
          className={`flex justify-between items-center text-sm font-medium py-3 hover:bg-slate-50 
            ${
              isFree &&
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
            disabled={isFree}
            dir="ltr"
            checked={useWallet}
            onCheckedChange={(checked: boolean) => setUseWallet(checked)}
          />
        </Badge>
      )}

      {/* //! DISCOUNT BUTTON */}
      <Form {...form}>
        <form className="relative" onSubmit={form.handleSubmit(applyDiscount)}>
          {
            <>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={!!coupon || isFree}
                        className="relative pl-20 font-medium tracking-wide bg-background en-digits text-right"
                        placeholder="کد تخفیف"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                disabled={applyDiscountLoading || isFree}
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
          }
        </form>
      </Form>

      <ToggleGroup
        disabled={isFree}
        onValueChange={setPaymentMethodForm}
        defaultValue={isFree ? undefined : paymentMethod}
        value={paymentMethod}
        dir="rtl"
        type="single"
        variant={"outline"}
      >
        <ToggleGroupItem
          className="w-full"
          value="ZARRIN_PAL"
          aria-label="Toggle bold"
        >
          <Image alt="logo" src={zarrinpalLogo} width={25} height={25} />
          پرداخت نقدی
        </ToggleGroupItem>
        <ToggleGroupItem
          className="w-full"
          value="DIGIPAY"
          aria-label="Toggle italic"
        >
          <Image alt="logo" src={digipayLogo} width={23} height={23} />
          پرداخت اقساطی
        </ToggleGroupItem>
      </ToggleGroup>

      <CashBackCard
        price={cartTotal}
        dontApplyCashback={form.getValues("paymentMethod") === "DIGIPAY"}
      />

      <Button
        disabled={loading || !form.getValues("paymentMethod")}
        className="w-full"
        onClick={onPayment}
      >
        <Loader loading={loading} />
        {loading ? (
          "در حال انتقال"
        ) : isFree ? (
          "ثبت نام رایگان"
        ) : paymentMethod === "ZARRIN_PAL" ? (
          <span className="flex">
            پرداخت {formatPriceBy3Digits(cartTotal)} تومان
          </span>
        ) : (
          <span className="flex">انتقال به دیحی‌پی</span>
        )}
      </Button>
    </div>
  );
};

export default CheckoutForm;
