import { AssetStatus, database, Prisma } from "@igraph/database";
import Filter from "@igraph/ui/components/Filter";
import NewButton from "@igraph/ui/components/NewButton";
import Search from "@igraph/ui/components/Search";
import { globalPageSize, pagination } from "@igraph/utils";
import AssetsList from "./AssetsList";
interface Props {
  searchParams: Promise<{
    page: string;
    status: AssetStatus;
    search: string;
    download: "MOST" | "LEAST";
  }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, status, search, download } = await searchParams;
  const { skip, take } = pagination(page);

  const where: Prisma.AssetWhereInput = {
    status,
    title: { contains: search },
  };

  const assets = await database.asset.findMany({
    where,
    include: {
      image: true,
      categories: { include: { category: true } },
      gallery: { include: { image: true } },
    },
    orderBy: download
      ? { downloadCount: download === "MOST" ? "desc" : "asc" }
      : { id: "desc" },
    skip,
    take,
  });
  const totalAssets = await database.asset.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalAssets} Assets</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search />

          <Filter
            placeholder="Filter By Status"
            name="status"
            options={[
              { label: "Published", value: "PUBLISHED" },
              { label: "Drafts", value: "DRAFT" },
            ]}
          />

          <Filter
            placeholder="Filter By Download"
            name="download"
            options={[
              { label: "Most Downloaded", value: "MOST" },
              { label: "Least Downlaoded", value: "LEAST" },
            ]}
          />

          <NewButton href="/assets/new" title="New Asset" />
        </div>
      </div>

      <AssetsList
        assets={assets}
        totalAssets={totalAssets}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;
