import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";

import Basic from "./Basic";
import Variant from "./Variant";
import { Button, Typography } from "@mui/material";

import { useCallback } from "react";
import TextEditor from "components/TextEditor";
import CategoryPicker from "components/CategoryPicker";
import { toast } from "react-toastify";
const initState = {
  name: "",
  description: "",
  status: "con_hang",
  slug: "",
  thumb: -1,
  variants: [],
  categories: [],
};

export default function ProductForm({
  preload = false,
  onUpdate,
  onCreate,
  type = "create",
}) {
  const [product, setProduct] = React.useState(() => {
    if (typeof preload === "object") {
      return preload;
    }
    return { ...initState };
  });

  const handleInput = useCallback((key, value) => {
    setProduct((old) => ({ ...old, [key]: value }));
  }, []);
  const [showCate, setShowCate] = useState(false);
  const onSubmit = () => {
    let lock = false;

    return async (e) => {
      try {
        if (lock)
          return toast("bạn đã ấn nút này rồi, vui lòng đợi xử lý.", {
            type: toast.TYPE.WARNING,
          });
        lock = true;

        if (type === "create") {
        } else if (type === "update") {
        }

        lock = false;
      } catch (e) {
        lock = false;
        return toast("có lỗi xảy ra!", { type: toast.TYPE.ERROR });
      }
    };
  };
  return (
    <div className={styles.container}>
      <div className="right-aligned-flex">
        <Button color="primary" variant="contained" onClick={onSubmit()}>
          Tạo sản phẩm
        </Button>
        <Button color="secondary" variant="contained">
          Hủy
        </Button>
      </div>
      <div className={styles.basic}>
        <Basic product={product} setProduct={handleInput} />
      </div>
      <div>
        <div className="right-aligned-flex">
          <p>
            {product.categories.map((e) => (
              <span>{e.name}-</span>
            ))}
          </p>
          <Button
            onClick={() => {
              setShowCate(true);
            }}
            variant="contained"
            color="primary"
          >
            Chọn danh mục
          </Button>
        </div>
        {showCate && (
          <CategoryPicker
            preload={product.categories}
            onSelect={(arr) => {
              setProduct((old) => ({ ...old, categories: arr }));
            }}
            onClose={() => {
              setShowCate(false);
            }}
          />
        )}
      </div>
      <div className={styles.variant}>
        <Variant product={product} setProduct={handleInput} />
      </div>

      <div className={styles.description}>
        <TextEditor
          setState={(text) => {
            setProduct((old) => ({ ...old, description: text }));
          }}
        />
      </div>
    </div>
  );
}
