import React from "react";
import CheckoutGroup from "./CheckoutGroup";
import CartItem from "./CartItem";
import styles from "./style.module.scss";
export default function Checkout({ cart = [] }) {
  return (
    <div className={styles.container}>
      <div>
        {cart.map((c) => (
          <CartItem key={c.id} data={c} />
        ))}
      </div>
      <CheckoutGroup cart={cart}/>
    </div>
  );
}
