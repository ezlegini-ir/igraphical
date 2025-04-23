import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@igraph/ui/components/ui/button";

const ViewButton = ({ href }: { href?: string }) => {
  return (
    <Link href={href || ""}>
      <Button
        size={"icon"}
        variant={"secondary"}
        className="rounded-full h-8 w-8 group"
      >
        <Eye className="text-gray-500 group-hover:text-primary scale-90" />
      </Button>
    </Link>
  );
};

export default ViewButton;
