import OverallOffForm from "@/components/forms/marketing/OverallOffForm";
import { database } from "@igraph/database";

const page = async () => {
  const overallOff = await database.overallOff.findFirst();

  return (
    <div className="space-y-3 max-w-lg">
      <div>
        <h3>Overall Off</h3>
        <p className="text-gray-500 text-sm">
          Set an Overall Discount for all courses
        </p>
      </div>

      <OverallOffForm overallOff={overallOff} />
    </div>
  );
};

export default page;
