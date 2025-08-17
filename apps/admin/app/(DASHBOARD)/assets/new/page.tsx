import AssetForm from "@/components/forms/asset/AssetForm";
import { database } from "@igraph/database";

const page = async () => {
  const categories = await database.assetCategory.findMany();

  return (
    <div className="space-y-3">
      <h3>Create New Asset</h3>

      <AssetForm type="NEW" categories={categories} />
    </div>
  );
};

export default page;
