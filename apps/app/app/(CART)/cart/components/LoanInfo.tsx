import { Separator } from "@igraph/ui/components/ui/separator";
import { formatPriceBy3Digits } from "@igraph/utils";
import moment from "moment-jalaali";

interface Props {
  installmentProfit: number;
  cartTotal: number;
  loadRete: number;
}

const LoanInfo = ({ cartTotal, installmentProfit, loadRete }: Props) => {
  const maxAmontOfLoan = 5_000_000;
  const installmentAmountPerMonth =
    cartTotal <= maxAmontOfLoan ? cartTotal / 4 : maxAmontOfLoan / 4;

  return (
    <div className="bg-secondary p-5 rounded-lg">
      <ul className="space-y-2 text-xs">
        <li className="flex justify-between">
          <span>اقساط</span>
          <span>3 ماهه / 1 ماهه</span>
        </li>
        <li className="flex justify-between">
          <span>مبلغ افزوده شده</span>
          <span>{formatPriceBy3Digits(installmentProfit)}</span>
        </li>
        <li className="flex justify-between">
          <span>مبلغ تمام شده</span>
          <span>{formatPriceBy3Digits(cartTotal)}</span>
        </li>

        <Separator />
        <li className="flex justify-between">
          <span>
            پیش پرداخت -{" "}
            {formatPriceBy3Digits(
              cartTotal <= maxAmontOfLoan
                ? installmentAmountPerMonth
                : cartTotal - maxAmontOfLoan
            )}
          </span>
          <span className="text-primary font-semibold">هم‌اینک</span>
        </li>
        <li className="flex justify-between">
          <span>
            قسط اول - {formatPriceBy3Digits(installmentAmountPerMonth)}
          </span>
          <span>{getJalaliMonthAfter(1)}</span>
        </li>
        <li className="flex justify-between">
          <span>
            قسط دوم - {formatPriceBy3Digits(installmentAmountPerMonth)}
          </span>
          <span>{getJalaliMonthAfter(2)}</span>
        </li>
        <li className="flex justify-between">
          <span>
            قسط سوم - {formatPriceBy3Digits(installmentAmountPerMonth)}
          </span>
          <span>{getJalaliMonthAfter(3)}</span>
        </li>
      </ul>
    </div>
  );
};

export default LoanInfo;

function getJalaliMonthAfter(monthsToAdd: number) {
  return moment()
    .add(monthsToAdd, "jMonth")
    .startOf("jMonth")
    .format("jYYYY/jMM/jDD");
}
