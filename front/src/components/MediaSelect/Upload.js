import React, { useEffect, useState } from "react";
import styles from "./Upload.module.scss";
import classnames from "classnames";
import { Button, Typography } from "@mui/material";
import { useUpload } from "api/rest/upload";
import { toast } from "react-toastify";
export default function Upload({ onUploadSuccess }) {
  const { images, onSetImages, inputRef, onButtonClick, onUpload } =
    useMediaUpload(onUploadSuccess);

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
const useMediaUpload = (onUploadSuccess) => {
  const inputRef = React.useRef(null);
  const [images, setImages] = useState([]);
  const [upload, { result, error }] = useUpload();
  const onSetImages = (e) => {
    if (e?.target?.files === undefined) return;
    const preview = Array.from(e.target.files).map((e) =>
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
        if (inputRef?.current?.files) upload(inputRef.current.files);
      } catch (e) {
        toast("Không thể upload");
      }
    };
  };

  useEffect(() => {
    if (result) {
      toast("upload thành công!");
      onUploadSuccess();
    }
  }, [result]);

  return { images, onSetImages, inputRef, onButtonClick, onUpload };
};
