import React, { useState } from "react";
import styles from "./styles.module.scss";
import BreadScrumb from "./BreadScrumb";
import Images from "./Images";
import Information from "./Information";
import Description from "./Description";
import Suggest from "./Suggest";

export default function ProductUserView({ product }) {
  const { name, categories, variants, description,thumb } = product;
  const [selected,setSelected]=useState(-1);
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <BreadScrumb list={categories} />
      </div>
      <section className={styles.main}>
        <Images thumb={thumb} collections={variants} selectedVariant={selected}/>
        
        <Information product={product} onPick={(id)=>{setSelected(id)}} selected={selected}/>
      </section>
      <section>
        <Description text={description}/>
        <Suggest />
      </section>
    </div>
  );
}
