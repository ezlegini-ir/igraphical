import Avatar from "@igraph/ui/components/Avatar";
import IgraphLogoSquare from "@igraph/ui/components/IgraphLogoSquare";
import { Button } from "@igraph/ui/components/ui/button";
import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { NavbarProps } from "./NavBar";
import { usePathname } from "next/navigation";

const SmallNavBar = ({ user, isThereItemsInCart }: NavbarProps) => {
  const pathName = usePathname();
  const showProfileButton = pathName.startsWith("/courses/");

  return (
    <div className="px-2">
      <div className="flex justify-between">
        <Link href={"/"}>
          <IgraphLogoSquare size={48} />
        </Link>

        <div className="flex gap-2 text-gray-500">
          <Link href={"/cart"} className="relative">
            <Button variant={"outline"} size={"icon"}>
              <ShoppingCart className="scale-125" />
            </Button>
            {isThereItemsInCart && (
              <div className="h-2.5 animate-pulse w-2.5 rounded-full bg-red-500 z-10 absolute top-0 right-0 m-1" />
            )}
          </Link>

          {user ? (
            <Link href={"/panel"}>
              <Button variant={"outline"}>
                <Avatar src={user.image?.url} size={25} />
                {user.fullName}
              </Button>
            </Link>
          ) : (
            showProfileButton && (
              <Link href={"/panel"}>
                <Button size={"icon"} variant={"outline"}>
                  <User className="scale-125" />
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SmallNavBar;
