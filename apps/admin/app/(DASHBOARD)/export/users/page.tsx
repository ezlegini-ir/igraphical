import { ExportTabs } from "@/components/ExportTabs";
import Title from "@igraph/ui/components/Title";

const page = () => {
  return (
    <div className="space-y-3">
      <Title title="Export User Data" />

      <ExportTabs />
    </div>
  );
};

export default page;
