import React from "react";
import styles from "./Information.module.scss";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useLocation, useHistory } from "react-router";
import {toast} from 'react-toastify'
import classNames from "classnames";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { add } from "store/reducers/cart";
export default function Information({ product, onPick, selected }) {
  const { name, variants } = product;
  const picked = useMemo(() => {
    try {
      if (selected >= 0) {
        const item = variants.find((v) => v.id === selected);
        return item;
      }
      return {};
    } catch (e) {
      return {};
    }
  }, [selected, variants]);
  return (
    <div className={styles.container}>
      <div className={styles.Name}>
        <h1>{name}</h1>
      </div>

      <VariantItems variants={variants} onPick={onPick} selected={selected} />

      <div className={styles.price}>
        <p>Giá: {picked.base_price} VND</p>
      </div>
      <AddToCart product={picked} />
    </div>
  );
}
const VariantItems = ({ variants = [], onPick, selected = -1 }) => {
  return (
    <div className={styles.Variant}>
      <p>Chủng loại</p>
      <div className={styles.ItemsContainer}>
        {variants.map((v) => (
          <div
            onClick={() => {
              if (selected !== v.id) onPick(v.id);
              else onPick(-1);
            }}
            className={classNames(styles.VariantItem, {
              [styles.checked]: selected === v.id,
            })}
            key={v.id}
          >
            {v.name}
          </div>
        ))}
      </div>
    </div>
  );
};
const AddToCart = ({ product = false }) => {
  const { role } = useSelector((s) => s.user);
  const redirect = useHistory();
  const dispatch = useDispatch();
  if (role >= 0) {
    return (
      <div className={styles.addToCart}>
        <Button
          disabled={typeof product?.id !== "number"}
          onClick={() => {
            dispatch(add({...product,quantity:1}));
            toast("Đã thêm vào giỏ hàng!",{type:toast.TYPE.SUCCESS})
          }}
          variant="contained"
          color="primary"
        >
          Add To Cart
        </Button>
      </div>
    );
  }
  return (
    <div className={styles.addToCart}>
      <Button
        onClick={() => {
          redirect.push("/login?goback=1");
        }}
        variant="contained"
        color="primary"
      >
        Login to Continue
      </Button>
    </div>
  );
};
