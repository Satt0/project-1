import React from "react";
import styles from "./style.module.scss";
import classnames from "classnames";
import Upload from "./Upload";
import Gallery from "./Gallery";
export default function MediaSelect({onClose}) {
  React.useEffect(()=>{
    document.body.style.overflow="hidden"
    return()=>{
      document.body.style.overflow=""
    }
  })
  return (
    <div className={classnames(styles.wrapper, "flex-center-center")}>
      <button onClick={onClose} className={classnames(styles.closeButton)}>close</button>
      <div className={classnames(styles.container)}>
        <div className={classnames(styles.upload)}>
          <Upload />
        </div>
        <div className={classnames(styles.gallery)}>
          <Gallery />
        </div>
      </div>
    </div>
  );
}
