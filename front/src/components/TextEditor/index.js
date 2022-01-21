import { Button } from "@mui/material";
import React from "react";
import { DefaultEditor } from "react-simple-wysiwyg";
import styles from "./style.module.scss";
import MediaSelect from "components/MediaSelect";
import { useState } from "react";
import { getMediaURL } from "helpers/url/images";
import { useEffect } from "react";
export default function App({ setState }) {
  const [html, setHtml] = React.useState("");
  const [showMedia, setShowMedia] = useState(false);
  function onChange(e) {
    setHtml(e.target.value);
  }
  const onAddImage = (arr) => {
    setHtml(
      (old) => `${old} </br>
      ${arr
        .map(
          (e) => `<div class="img-wrapper">
      <img src="${getMediaURL(e.url)}"/>
      </div>`
        )
        .join(
          `
          </br>
          `
        )}
      `
    );
  };
  useEffect(() => {
    let a;
    a = setTimeout(() => {
      setState(html);
    }, 300);
    return () => {
      clearTimeout(a);
    };
  }, [html]);
  return (
    <div className={styles.container}>
      <div className="right-aligned-flex">
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            setShowMedia(true);
          }}
        >
          Thêm ảnh
        </Button>
      </div>
      {showMedia && (
        <MediaSelect
          type="multiple"
          onSelect={(arr) => {
            onAddImage(arr);
          }}
          onClose={() => {
            setShowMedia(false);
          }}
        />
      )}
      <DefaultEditor value={html} onChange={onChange} />
    </div>
  );
}
