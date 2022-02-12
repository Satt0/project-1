import React from "react";
import { useSelector } from "react-redux";
import Checkout from "components/Checkout";
export default function Cart() {
  const { items } = useSelector((s) => s.cart);
 
  return (
    <div>
      <Checkout cart={items}/>
    </div>
  );
}
