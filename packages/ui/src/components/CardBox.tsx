import { Button } from "@igraph/ui/components/ui/button";
import { Separator } from "@igraph/ui/components/ui/separator";
import Link from "next/link";
import React, { ReactNode } from "react";
import Title from "./Title";

const CardBox = ({
  title,
  btn,
  children,
  className,
}: {
  title: string;
  btn?: { title: string; href: string };
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`card px-0 py-0 space-y-0 ${className}`}>
      <div className="p-3 py-2 flex justify-between items-center h-11">
        <Title title={title} />

        {btn && (
          <Link href={btn.href}>
            <Button
              className="h-7 rounded-sm"
              variant={"secondary"}
              size={"sm"}
            >
              {btn.title}
            </Button>
          </Link>
        )}
      </div>

      <Separator />

      <div className="p-3 space-y-3 h-full">{children}</div>
    </div>
  );
};

export default CardBox;
