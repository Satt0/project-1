import React,{useState} from "react";
import styles from "./style.module.scss";
import classnames from "classnames";
import Upload from "./Upload";
import Gallery from "./Gallery";
export default function MediaSelect({ onClose, onSelect,type="single" }) {
  const [timeStamp,setState]=useState(0)
  console.log(timeStamp);
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  });
  return (
    <div className={classnames(styles.wrapper, "flex-center-center")}>
      {/* <button onClick={onClose} className={classnames(styles.closeButton)}>
        close
      </button> */}
      <div className={classnames(styles.container)}>
        <div className={classnames(styles.upload)}>
          <Upload onUploadSuccess={()=>{setState(Date.now())}}/>
        </div>
        <div className={classnames(styles.gallery)}>
          <Gallery onClose={onClose} type={type} onSelect={onSelect} timeStamp={timeStamp}/>
        </div>
      </div>
    </div>
  );
}
