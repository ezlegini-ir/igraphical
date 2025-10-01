import EarningsChart from "@/components/charts/analysis/IncomeChart";
import Expenses from "./Expenses";

const page = () => {
  return (
    <div className="space-y-4">
      <h3>Earnings</h3>

      <EarningsChart />

      <h3>Expenses</h3>

      <Expenses />
    </div>
  );
};

export default page;
