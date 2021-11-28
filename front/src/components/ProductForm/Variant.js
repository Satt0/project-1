import {
  Button,
  Typography,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import React from "react";
import classNames from "classnames";
import styles from "./Variant.module.scss";
import MediaSelect from "components/MediaSelect";
export default function Variant() {
  const [thisVariant, setVariants] = React.useState([]);
  const [openForm, setOpen] = React.useState(false);
  const onAddVariant=(newVariant)=>{
    console.log(newVariant);
  }
  return (
    <div className={classNames("flex-center-center", styles.container)}>
      {thisVariant.length === 0 && openForm === false && (
        <Typography>There is no Variant!</Typography>
      )}
      {thisVariant.map((v, index) => (
        <VariantItem />
      ))}
      {openForm && <VariantItem onCreate={onAddVariant} onExit={()=>{setOpen(false)}}/>}
      <div className="p-m">
        <Button
          onClick={() => {
            setOpen(true);
          }}
          variant="outlined"
        >
          Add Variant
        </Button>
      </div>
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
const VariantItem = ({ onCreate, onUpdate, onDelete,onExit, type = "create" }) => {
  const [
    { name, quantity, is_discount, is_stock, base_price, discount_price },
    setState,
  ] = React.useState(() => {
    return emptyVariant;
  });
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
      console.log(value);
      setState((s) => ({ ...s, [key]: value }));
    };
  };
  return (
    <div className={styles.variantItem}>
      <div className={styles.groupFieldVariant}>
        <TextField
          error={name.length === 0}
          onChange={handleChange("name", "text")}
          InputLabelProps={{ shrink: true }}
          value={name}
          helperText="Tên không được để rỗng."
          type="text"
          label="Tên loại"
        />
        <TextField
          onChange={handleChange("base_price", "text")}
          InputLabelProps={{ shrink: true }}
          value={base_price}
          type="number"
          label="giá cơ sở"
        />
        <TextField
          onChange={handleChange("quantity", "text")}
          InputLabelProps={{ shrink: true }}
          value={quantity}
          type="number"
          label="số lượng"
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
          disabled={is_discount === false}
        />
      </div>
      <div className={styles.imagesVariant}>
        <ImagePreview />
        <div className={styles.imagesVariantConfirm}>
          <Button onClick={()=>{onCreate()}} variant="outlined">Confirm</Button>
          <span style={{ marginLeft: 5 }}></span>
          <Button onClick={onExit} variant="outlined" color="error">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const ImagePreview = ({onSelect,onReset}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={styles.imagesPreview}>
      {open && <MediaSelect onClose={() => setOpen(false)} />}
      <div className={styles.imagesPreviewLeft}></div>
      <div className={styles.imagesPreviewRight}>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          <AddPhotoAlternateIcon />
        </Button>
        <Button>
          <RestartAltIcon />
        </Button>
      </div>
    </div>
  );
};
