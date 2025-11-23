import { Button } from "@igraph/ui/components/ui/button";
import { Trash } from "lucide-react";

const TrashButton = () => {
  return (
    <Button
      size={"icon"}
      variant={"secondary"}
      className="rounded-full h-8 w-8 group"
    >
      <Trash className="text-gray-500 group-hover:text-primary scale-90" />
    </Button>
  );
};

export default TrashButton;
