"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@igraph/ui/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  pageSize: number;
  totalItems: number;
}

const Pagination = ({ pageSize, totalItems }: Props) => {
  const pageCount = Math.ceil(totalItems / pageSize);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const changePage = (page: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", page.toString());

    router.push(`?${params.toString()}`);
  };

  if (pageCount < 2) return null;

  return (
    <div className="text-sm flex items-center">
      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === pageCount}
      >
        <ChevronRight />
      </Button>

      <span className="text-gray-500 mx-2">
        صفحه {currentPage} از {pageCount}
      </span>

      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </Button>
    </div>
  );
};

export default Pagination;
