import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";

import Basic from "./Basic";
import Variant from "./Variant";
import { Button, Typography } from "@mui/material";
import { useHistory } from "react-router";
import { useCallback } from "react";
import TextEditor from "components/TextEditor";
import CategoryPicker from "components/CategoryPicker";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { DELETE_PRODUCT } from "api/graphql/mutation/products";
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
  const url = useHistory();

  const handleInput = useCallback((key, value) => {
    setProduct((old) => ({ ...old, [key]: value }));
  }, []);
  const [showCate, setShowCate] = useState(false);
  const [deleteProduct, { error: errorDelete, data: dataDelete }] = useMutation(
    DELETE_PRODUCT,
    { fetchPolicy: "no-cache" }
  );
  useEffect(() => {
    let a;
    if (errorDelete) {
      return toast("không thể xóa sản phẩm!");
    }
    if (dataDelete) {
      toast("xóa thành công, tự động trở về sau 5s");
      a = setTimeout(() => {
        url.goBack();
      }, 5000);
      return;
    }
    return () => {
      clearTimeout(a);
    };
  }, [errorDelete, dataDelete]);
  const onSubmit = useCallback(() => {
    let lock = false;

    return async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        if (lock)
          return toast("bạn đã ấn nút này rồi, vui lòng đợi xử lý.", {
            type: toast.TYPE.WARNING,
          });
        lock = true;

        if (type === "create") {
          await onCreate(product);
        } else if (type === "update") {
          await onUpdate(product);
        }

        lock = false;
      } catch (e) {
        lock = false;
        return toast("có lỗi xảy ra!", { type: toast.TYPE.ERROR });
      }
    };
  }, [product, onCreate, onUpdate]);
  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit()}>
        <div className="right-aligned-flex">
          <Button color="primary" variant="contained" type="submit">
            {type === "create" ? "Tạo sản phẩm" : "Cập nhật sản phẩm"}
          </Button>
          <span className="p-sm"></span>
          {type === "update" && (
            <Button
              onClick={() => {
                if (product.id)
                  deleteProduct({
                    variables: {
                      input: parseInt(product.id),
                    },
                  });
              }}
              color="error"
              variant="contained"
            >
              Xóa
            </Button>
          )}
          <span className="p-sm"></span>
          <Button
            onClick={() => {
              url.goBack();
            }}
            color="secondary"
            variant="contained"
          >
            Hủy
          </Button>
        </div>
        <div className={styles.basic}>
          <Basic preload={preload} product={product} setProduct={handleInput} />
        </div>
              </form>
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
        <Variant
          preload={preload?.variants}
          product={product}
          setProduct={handleInput}
        />
      </div>

      <div className={styles.description}>
        <TextEditor
          preload={preload.description}
          setState={(text) => {
            setProduct((old) => ({ ...old, description: text }));
          }}
        />
      </div>
    </div>
  );
}
