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
export default function Basic({ product, setProduct }) {
  return (
    <div className={styles.container}>
      <div className={styles.thumb}>
        <ThumbInput />
      </div>
      <div className={styles.information}>
        <TextField
          className={styles.inputField}
          id="outlined-basic"
          label="Name"
          variant="outlined"
        />
        <TextField
          className={styles.inputField}
          id="filled-basic"
          label="Slug"
          variant="outlined"
        />
        <div>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={"oke"}
              label="Status"
            >
              <MenuItem value={10}>Còn Hàng</MenuItem>
              <MenuItem value={20}>Hết Hàng</MenuItem>
              <MenuItem value={30}>Hàng Đang Về</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
}

const ThumbInput = () => {
  const [openMedia, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState({});
  const onClose = () => {
    setOpen(false);
  };
  const onOpen = () => {
    setOpen(true);
  };
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
        <div className={styles.previewThumb}>
          <img src={getMediaURL(selected?.url)} alt="" />
        </div>
        <Button onClick={onOpen} variant="outlined">
          Choose Thumb
        </Button>
      </div>
    </div>
  );
};
