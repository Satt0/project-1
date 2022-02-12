import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useMemo } from "react";
import styles from "./style.module.scss";
import { useMutation } from "@apollo/client";
import { CHECKOUT_CART } from "api/graphql/mutation/checkout";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const getCartItems = (cart = []) => {
  return cart.map(
    ({ quantity, base_price, is_discount, discount_price, id }) => ({
      quantity,
      price: is_discount ? discount_price : base_price,
      product_id: parseInt(id),
    })
  );
};
export default function CheckoutGroup({ cart }) {
  const user = useSelector((s) => s.user);
  const totalPrice = useMemo(() => {
    try {
      return cart
        .map(
          ({ is_discount, discount_price, base_price, quantity = 1 }) =>
            (is_discount ? discount_price : base_price) * quantity
        )
        .reduce((a, c) => a + c);
    } catch (e) {
      return 0;
    }
  }, [cart]);
  const [checkout, { data, error, loading }] = useMutation(CHECKOUT_CART, {
    fetchPolicy: "no-cache",
  });
  useEffect(()=>{
    if(error){
      return toast("không thành công!",{type:toast.TYPE.ERROR})
    }
    if(data){
      return toast("thành công!",{type:toast.TYPE.SUCCESS})
    }
  },[error,data])
  return (
    <div>
      <div>
        <p>Total: {totalPrice} VND</p>
      </div>
      <div>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            checkout({
              variables: {
                input: {
                  user: parseInt(user.id),
                  items: getCartItems(cart),
                },
              },
            }).catch(e=>{});
          }}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
