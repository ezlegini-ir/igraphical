import AssetForm from "@/components/forms/asset/AssetForm";
import { getAssetById } from "@/data/asset";
import { database } from "@igraph/database";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;

  const asset = await getAssetById(id);
  const categories = await database.assetCategory.findMany();

  if (!asset) notFound();

  return (
    <div className="space-y-3">
      <h3>Update Asset</h3>

      <AssetForm type="UPDATE" asset={asset} categories={categories} />
    </div>
  );
};

export default page;
