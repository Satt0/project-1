import React from "react";
import styles from "./ProductCard.module.scss";
import { getMediaURL } from "helpers/url/images";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
export default function ProductCard({ product, type = "admin" }) {
  const {
    name,
    slug,
    images = [],
    origin,
    id,
    is_discount,
    discount_price,
    base_price,
  } = product;
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div
          className={styles.thumb}
          style={{ backgroundImage: `url("${getMediaURL(images[0]?.url ?? origin.thumb?.url)}")` }}
        ></div>

        <div className={styles.name}>
          <p>sản phẩm: {origin.name}</p>
          <p>phân loại: {name}</p>
          <p>giá: {is_discount ? discount_price : base_price} VND</p>
        </div>
      </div>
      <AdminButtons product={product} />
    </div>
  );
}
const AdminButtons = ({ product }) => {
  const { name, slug, thumb, variants, id, origin } = product;
  const url = useHistory();
  return (
    <div className={styles.groupButtons}>
      <button
        onClick={() => {
          url.push(`/admin/edit-product/${origin.id}`);
        }}
      >
        Edit
      </button>

      <button>Delete</button>
    </div>
  );
};

const UserButtons = ({ product }) => {
  const { name, slug, thumb, variants, id, origin } = product;
  const url = useHistory();
  return (
    <div className={styles.groupButtons}>
      <button>Add</button>

      <button>View</button>
    </div>
  );
};
