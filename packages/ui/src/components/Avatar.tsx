import { Skeleton } from "@igraph/ui/components/ui/skeleton";
import Image from "next/image";

const Avatar = ({ src, size }: { src: string | undefined; size?: number }) => {
  return (
    <div className=" rounded-full relative overflow-hidden aspect-square h-min">
      <Skeleton className="absolute inset-0 -z-10" />
      <Image
        src={src || "/avatar.svg"}
        alt="user"
        width={size || 40}
        height={size || 40}
        className="rounded-full object-cover aspect-square bg-slate-300"
      />
    </div>
  );
};

export default Avatar;
