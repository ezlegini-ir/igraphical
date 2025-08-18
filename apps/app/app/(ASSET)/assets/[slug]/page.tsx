import { database } from "@igraph/database";
import { notFound } from "next/navigation";
import AssetContent from "./AssetContent";

interface Props {
  params: Promise<{ slug: string }>;
}

const page = async ({ params }: Props) => {
  const { slug } = await params;

  const asset = await database.asset.findFirst({
    where: { url: slug },
    include: {
      image: true,
    },
  });

  if (!asset) notFound();

  return <AssetContent asset={asset} />;
};

export default page;
