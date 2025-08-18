import AssetForm from "@/components/forms/asset/AssetForm";

const page = async () => {
  return (
    <div className="space-y-3">
      <h3>Create New Asset</h3>

      <AssetForm type="NEW" />
    </div>
  );
};

export default page;
