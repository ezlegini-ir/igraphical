import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@igraph/ui/components/ui/breadcrumb";
import Link from "next/link";

interface Props {
  steps: { label: string; href: string }[];
  finalStep: string;
}

const BreadCrumb = ({ steps, finalStep }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/"}>خانه</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {steps.map((step, index) => (
          <div className="flex gap-3" key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={step.href}>{step.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </div>
        ))}

        <BreadcrumbItem>
          <BreadcrumbPage>{finalStep}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
