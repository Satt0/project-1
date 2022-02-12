import React, { useMemo } from "react";
import styles from "./style.module.scss";
import { getMediaURL } from "helpers/url/images";
import { useDispatch } from "react-redux";
import { edit,deleteItem } from "store/reducers/cart";
export default function CartItem({ data = {} }) {
  const {
    id,
    name,
    is_discount,
    discount_price,
    base_price,
    quantity,
    images = [],
  } = data;
  const price = useMemo(() => {
    const stockPrice = is_discount ? discount_price : base_price;
    return stockPrice;
  }, [data]);
  const dispatch = useDispatch();
  const changeQuantity = (type = "add") => {
    return () => {
      const add = edit({ id, quantity: quantity + 1 });
      const sub = edit({ id, quantity: quantity - 1 });
      dispatch(type === "add" ? add : sub);
    };
  };
  const deleteCartItem=()=>{
    dispatch(deleteItem({id}))
  }
  return (
    <div className={styles.cartItem}>
      <div
        className={styles.cartItemThumb}
        style={{
          backgroundImage:
            typeof images[0]?.url === "string"
              ? `url("${getMediaURL(images[0].url)}")`
              : undefined,
        }}
      ></div>
      <div className={styles.cartItemButton}>
        <p>Sản phẩm: {name}</p>
        <p>Giá: {price} VND</p>
        <p>Số lượng: {quantity} </p>
        <button onClick={changeQuantity('add')}>+</button>
        <button  onClick={changeQuantity('sub')}>-</button>
        <button  onClick={deleteCartItem}>delete</button>
      </div>
    </div>
  );
}
