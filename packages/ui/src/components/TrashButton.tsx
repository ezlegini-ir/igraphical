import Link from "next/link";
import React from "react";
import { Button } from "@igraph/ui/components/ui/button";
import { PencilIcon, Trash } from "lucide-react";

const TrashButton = ({ href }: { href: string }) => {
  return (
    <Link href={href}>
      <Button
        size={"icon"}
        variant={"secondary"}
        className="rounded-full h-8 w-8 group"
      >
        <Trash className="text-gray-500 group-hover:text-primary scale-90" />
      </Button>
    </Link>
  );
};

export default TrashButton;
