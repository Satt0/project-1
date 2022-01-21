import React from "react";
import MediaSelect from "components/MediaSelect";
import {
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import styles from "./Basic.module.scss";
import classNames from "classnames";
import { getMediaURL } from "helpers/url/images";
import { useEffect } from "react";
export default function Basic({ product, setProduct, defaultValue }) {
  return (
    <div className={styles.container}>
      <div className={styles.thumb}>
        <ThumbInput
          onSelected={(id) => {
            setProduct("thumb", id);
          }}
        />
      </div>
      <div className={styles.information}>
        <TextField
          className={styles.inputField}
          id="outlined-basic"
          label="Name"
          variant="outlined"
          value={product.name}
          onChange={(e)=>{setProduct('name',e.target.value)}}
        />
        <TextField
          className={styles.inputField}
          id="filled-basic"
          label="Slug"
          variant="outlined"
          value={product.slug}
          onChange={(e)=>{setProduct('slug',e.target.value)}}
        />
        <div>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={product.status}
              onChange={(e)=>{setProduct('status',e.target.value)}}
              label="Status"
            >
              <MenuItem value={"con_hang"}>Còn Hàng</MenuItem>
              <MenuItem value={"het_hang"}>Hết Hàng</MenuItem>
              <MenuItem value={"dang_ve"}>Hàng Đang Về</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
}

const ThumbInput = ({ onSelected }) => {
  const [openMedia, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState({});
  const onClose = () => {
    setOpen(false);
  };
  const onOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    if (selected?.id) onSelected(selected.id);
  }, [selected]);
  return (
    <div className={styles.thumbContainer}>
      {openMedia && (
        <MediaSelect
          onSelect={(e) => {
            setSelected(e[0] ?? []);
          }}
          onClose={onClose}
        />
      )}
      <div className={classNames(styles.content, "flex-center-center")}>
        <div className={styles.previewThumb} style={{backgroundImage:`url("${getMediaURL(selected?.url)}")`}}>
          {!selected?.url && <p className="text-center">bạn chưa chọn ảnh nào</p>}
        </div>
        <Button onClick={onOpen} variant="outlined">
          Choose Thumb
        </Button>
      </div>
    </div>
  );
};
