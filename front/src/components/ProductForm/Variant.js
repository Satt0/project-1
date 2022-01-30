import {
  Button,
  Typography,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  Badge,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "./Variant.module.scss";
import MediaSelect from "components/MediaSelect";
import { getMediaURL } from "helpers/url/images";
// array of variants
export default function Variants({ setProduct,preload=[] }) {
  const [thisVariant, setVariants] = React.useState(preload);
  const [openForm, setOpen] = React.useState(false);
  const onAddVariant = (newVariant) => {
    setVariants((old) => [...old, newVariant]);
  };
  const onDelete = React.useCallback((index) => {
    setVariants((old) => old.filter((_, i) => i !== index));
  }, []);
  const onExit = React.useCallback(() => {
    setOpen(false);
  }, []);
  const onUpdate = React.useCallback((index) => {
    return (item) => {
      setVariants((old) =>
        old.map((v, i) => {
          if (index === i) {
            return { ...item };
          }
          return v;
        })
      );
    };
  }, []);
  useEffect(() => {
    if (thisVariant) {
      setProduct("variants", thisVariant);
    }
  }, [thisVariant]);
  return (
    <div className={classNames("flex-center-center", styles.container)}>
      {thisVariant.length === 0 && openForm === false && (
        <Typography>There is no Variant!</Typography>
      )}
      {thisVariant.map((v, index) => (
        <div style={{ marginBottom: 10, width: "100%" }}>
          <VariantItem
            responsive={true}
            onExit={onExit}
            order={index}
            onDelete={onDelete}
            preload={v}
            onUpdate={onUpdate(index)}
            type="update"
          />
        </div>
      ))}
      {openForm && (
        <div>
          <VariantItem
            type="create"
            onCreate={onAddVariant}
            onExit={() => {
              setOpen(false);
            }}
          />
        </div>
      )}
      {openForm === false && (
        <div className="p-m">
          <Button
            onClick={() => {
              setOpen(true);
            }}
            variant="outlined"
          >
            Tạo loại mới
          </Button>
        </div>
      )}
    </div>
  );
}

const emptyVariant = {
  name: "",
  quantity: 0,
  base_price: 0,
  is_stock: true,
  is_discount: false,
  discount_price: 0,
  images: [],
};
const VariantItem = ({
  preload = false,
  onCreate,
  onUpdate,
  onDelete,
  onExit,
  type = "create",
  order = -1,
  responsive = false,
}) => {
  const [
    {
      name,
      quantity,
      is_discount,
      is_stock,
      base_price,
      discount_price,
      images,
    },
    setState,
  ] = React.useState(() => {
    if (typeof preload === "object") {
      return preload;
    }
    return emptyVariant;
  });
  const [changed, setChanged] = React.useState(null);
  const [isMinmized, setMinimized] = useState(responsive);

  const handleChange = (key, type = "text") => {
    return (event) => {
      let value;
      switch (type) {
        case "text":
          value = event.target.value;
          break;
        case "check":
          value = event.target.checked;
          break;
        default:
          return;
      }

      setState((s) => ({ ...s, [key]: value }));
    };
  };

  useEffect(() => {
    setChanged(true);
  }, [
    name,
    quantity,
    is_discount,
    is_stock,
    base_price,
    discount_price,
    images,
  ]);
  useEffect(() => {
    setChanged(false);
  }, []);
  return (
    <div>
      {isMinmized === true && responsive === true && (
        <div className={styles.Minimized}>
          <div>
            <Typography>Tên sản phẩm: {name}</Typography>
          </div>
          <Button
            onClick={() => {
              setMinimized(false);
            }}
            variant="outlined"
            color="secondary"
          >
            {isMinmized ? "Show" : "Hide"}
          </Button>
        </div>
      )}
      {isMinmized === false && (
        <form
          className={styles.variantItem}
          onSubmit={(e) => {
            e.preventDefault();

            if (type === "create") {
              onCreate({
                name,
                quantity,
                is_discount,
                is_stock,
                base_price,
                discount_price,
                images,
              });
            }
            if (type === "update") {
              setChanged(false);
              onUpdate({
                name,
                quantity,
                is_discount,
                is_stock,
                base_price,
                discount_price,
                images,
              });
            }
            onExit();
            e.stopPropagation();
          }}
        >
          <div className={styles.groupFieldVariant}>
            <TextField
              error={name.length === 0}
              onChange={handleChange("name", "text")}
              InputLabelProps={{ shrink: true }}
              value={name}
              helperText="Tên không được để rỗng."
              type="text"
              label="Tên loại"
              required
            />
            <TextField
              onChange={handleChange("base_price", "text")}
              InputLabelProps={{ shrink: true }}
              value={base_price}
              type="number"
              label="giá cơ sở"
              required
            />
            <TextField
              onChange={handleChange("quantity", "text")}
              InputLabelProps={{ shrink: true }}
              value={quantity}
              type="number"
              label="số lượng"
              required
            />
            <FormGroup>
              <FormControlLabel
                onChange={handleChange("is_stock", "check")}
                control={<Checkbox checked={is_stock} />}
                label="còn hàng?"
              />
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                onChange={handleChange("is_discount", "check")}
                control={<Checkbox checked={is_discount} />}
                label="giảm giá?"
              />
            </FormGroup>
            <TextField
              onChange={handleChange("discount_price", "text")}
              InputLabelProps={{ shrink: true }}
              error={
                is_discount === true &&
                parseInt(discount_price) > parseInt(base_price)
              }
              value={discount_price}
              helperText="Giá giảm phải nhỏ hơn giá gốc."
              type="number"
              label="giá sau khi giảm"
              required={is_discount === true}
              disabled={is_discount === false}
            />
          </div>
          <div className={styles.imagesVariant}>
            <ImagePreview
              selected={images}
              onSelect={(arr) => {
                setState((old) => ({ ...old, images: arr }));
              }}
              onReset={() => {
                setState((old) => ({ ...old, images: [] }));
              }}
              onFilter={(index) => {
                setState((old) => ({
                  ...old,
                  images: old.images.filter((_, i) => i !== index),
                }));
              }}
            />
            <div className={styles.imagesVariantConfirm}>
              <Button
                disabled={type === "update" && changed === false}
                type="submit"
                variant="outlined"
              >
                {type === "create" ? "CREATE" : `UPDATE${changed ? "" : "D"}`}
              </Button>
              <span style={{ marginLeft: 5 }}></span>
              <Button
                onClick={() => {
                  if (type === "update") onDelete(order);

                  onExit();
                }}
                variant="outlined"
                color="error"
              >
                {type === "create" ? "CANCEl" : "DELETE"}
              </Button>
              <span style={{ marginLeft: 5 }}></span>
              {responsive && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setMinimized(true);
                  }}
                >
                  Hide
                </Button>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

const ImagePreview = ({ onSelect, onReset, selected = [], onFilter }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={styles.imagesPreview}>
      {open && (
        <MediaSelect
          type="multiple"
          onSelect={onSelect}
          onClose={() => setOpen(false)}
        />
      )}
      <div className={styles.imagesPreviewLeft}>
        {selected?.length <= 0 && <p>chưa có ảnh nào.</p>}
        {selected.map((image, index) => (
          <div className={styles.imagesPreviewLeftImage} key={image.id}>
            <div
              className={styles.badges}
              onClick={() => {
                onFilter(index);
              }}
            >
              <Badge color="secondary" badgeContent={"x"}>
                <span></span>
              </Badge>
            </div>
            <img src={getMediaURL(image.url)} />
          </div>
        ))}
      </div>
      <div className={styles.imagesPreviewRight}>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          <AddPhotoAlternateIcon />
        </Button>
        <Button onClick={onReset}>
          <RestartAltIcon />
        </Button>
      </div>
    </div>
  );
};
