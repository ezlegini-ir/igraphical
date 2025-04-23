"use client";

import { Cart as CartType, Wallet } from "@igraph/database";
import { useEffect, useState } from "react";
import CartList, { CartItemType } from "./CartList";
import CheckoutForm from "./CheckoutForm";

interface Props {
  cart: CartType & { cartItem: CartItemType[] };
  wallet: Wallet | null;
}

export type priceType = { price: number; originalPrice: number };

const Cart = ({ cart, wallet }: Props) => {
  const initialPrices = cart.cartItem.map((item) => ({
    price: item.course.price,
    originalPrice: item.course.basePrice,
  }));
  const [prices, setPrices] = useState<priceType[]>(initialPrices);

  useEffect(() => {
    setPrices(initialPrices);
  }, [cart.cartItem]);

  const courses = cart.cartItem.map((item) => item.course);

  return (
    <>
      <div className="w-full lg:w-10/12">
        <CartList cartItems={cart?.cartItem} prices={prices} />
      </div>

      <div className="w-full md: lg:w-4/12 card p-5  h-min space-y-3 overflow-visible">
        <CheckoutForm
          courses={courses}
          wallet={wallet}
          prices={prices}
          setPrices={setPrices}
        />
      </div>
    </>
  );
};

export default Cart;
