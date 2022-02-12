import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Typography } from "@mui/material";
import styles from './Description.module.scss'
export default function Description({ text }) {
  return (
    <div className={styles.container}>
      <Typography variant="h3" component="div" className="text-center">Thông tin sản phẩm</Typography>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        children={text ?? ""}
      ></ReactMarkdown>
    </div>
  );
}
