import React, { useState, useEffect } from "react";
import styles from "./Grid.module.scss";
import ProductCard from "./ProductCard";
import classNames from "classnames";
export default function Grid({ list = [], view = "grid", onNameChange }) {
  const [name, setName] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    onNameChange(name);
  };
  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <form className={styles.form} onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="nhập sản phẩm cần tìm kiếm"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button>Search</button>
        </form>
      </div>
      <div className={classNames(styles.display,styles.grid)}>
        {list.map((e) => (
          <ProductCard key={e.id} product={e}></ProductCard>
        ))}
        {list.length===0 && <p>Không có sản phẩm nào</p>}
      </div>
    </div>
  );
}
