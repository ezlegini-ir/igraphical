import React from "react";
import Image from "next/image";
import { notFound as notFoundImage } from "@/public";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@igraph/ui/components/ui/button";
import NavBar from "@/components/NavBar";
import SimpleFooter from "@/components/SimpleFooter";

const notFound = () => {
  return (
    <>
      <div className="max-w-screen-xl mx-auto p-3 h-screen grid grid-rows-[auto_1fr_auto]">
        <NavBar />
        <div className="flex flex-col items-center justify-center select-none my-6">
          <Image
            src={notFoundImage}
            alt="not-found"
            width={860}
            height={860}
            draggable={false}
          />
          <Link href={"/"} className="btn btn-primary py-3">
            <Button>صفحه اصلی</Button>
          </Link>
        </div>
        <SimpleFooter />
      </div>
    </>
  );
};

export default notFound;

export const metadata: Metadata = {
  title: "☹️ 404 گشتیم نبود",
};
