import Avatar from "@igraph/ui/components/Avatar";
import { formatPrice } from "@igraph/utils";
import { Image, User, Wallet } from "@igraph/database";
import { formatDistance } from "date-fns";
import Link from "next/link";
import React from "react";

interface WalletType extends Wallet {
  user: User & { image: Image | null };
}

interface Props {
  bestWallets: WalletType[];
}

const BestWallets = ({ bestWallets }: Props) => {
  return (
    <div className="col-span-12 lg:col-span-6 xl:col-span-3 card h-min">
      <h4 className="text-gray-600">Best Wallets</h4>
      <ul className="space-y-3">
        {bestWallets.map((item, index) => (
          <li
            className="flex items-center justify-between gap-3 text-sm"
            key={index}
          >
            <Link
              href={`/students?search=${item.user.email}`}
              className="flex gap-3 items-center"
            >
              <Avatar src={item.user.image?.url} />
              <div className="flex flex-col">
                <span>{item.user.fullName}</span>
                <span className="text-xs text-gray-500">
                  Joined{" "}
                  {formatDistance(item.user.joinedAt, new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Link>

            <Link href={`?search=${item.user.email}`} className="flex flex-col">
              <span>{formatPrice(item.balance)}</span>
              <span className="text-xs text-gray-500">
                used {item.used} times
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BestWallets;
