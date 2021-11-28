import React from "react";
import styles from "./Upload.module.scss";
import classnames from "classnames";
import { Button, Typography } from "@mui/material";
export default function Upload({ onUploadSuccess }) {
  const { images, onSetImages, inputRef, onButtonClick, onUpload } =
    useMediaUpload();

  return (
    <div className={styles.container}>
      <form className={classnames(styles.upload, "flex-center-center")}>
        <input
          multiple
          onChange={onSetImages}
          type="file"
          required
          ref={inputRef}
        />
        <Button variant="outlined" onClick={onButtonClick}>
          Choose Media
        </Button>
      </form>
      <div>
        <Typography>
          <p className={classnames("text-center", "p-m")}>your selection</p>
        </Typography>
        <div className={styles.preview}>
          {images.map((src, index) => (
            <ImagePreview key={"preview" + index} src={src} />
          ))}
        </div>
        <div className="flex-center-center">
          <Button
            variant="contained"
            color="secondary"
            onClick={onUpload(onUploadSuccess)}
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
const ImagePreview = ({ src }) => {
  return (
    <div className={styles.imagesContainer}>
      <img src={src} alt="preview" />
    </div>
  );
};
const useMediaUpload = () => {
  const inputRef = React.useRef(null);
  const [images, setImages] = React.useState([]);

  const onSetImages = () => {
    if (inputRef === null) return;
    const preview = Array.from(inputRef.current.files).map((e) =>
      URL.createObjectURL(e)
    );

    setImages(preview);
  };
  const onButtonClick = () => {
    if (inputRef !== null) inputRef.current.click();
  };
  const onUpload = (callback) => {
    return async () => {
      try {
      } catch (e) {
      } finally {
          
      }
    };
  };

  return { images, onSetImages, inputRef, onButtonClick, onUpload };
};
