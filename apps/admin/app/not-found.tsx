import { Button } from "@igraph/ui/components/ui/button";
import { FileWarning } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

const notFound = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-3 h-screen bg-black text-white">
      <FileWarning size={50} />
      Not Found
      <Link href={"/"}>
        <Button>Home</Button>
      </Link>
    </div>
  );
};

export default notFound;

export const metadata: Metadata = {
  title: "404: Not Found",
};
