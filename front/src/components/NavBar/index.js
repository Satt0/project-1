import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector, useDispatch } from "react-redux";
import styles from "./style.module.scss";
import { useHistory } from "react-router-dom";
import { logout } from "store/reducers/user";
export default function NavBar() {
  const { role } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="transparent" position="static">
        <Toolbar>
          {role < 0 && <PublicNav />}
          {role === 0 && <UserNav onLogout={onLogout} />}
          {role >= 1 && <AdminNav onLogout={onLogout} />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
const UserNav = ({ onLogout }) => {
  const { user, cart } = useSelector((s) => s);
  const url = useHistory();
  return (
    <div className={styles.groupNav}>
      <Button
        onClick={() => {
          url.push("/");
        }}
        color="secondary"
        variant="outlined"
      >
        Trang chủ
      </Button>
      <div className="right-aligned-flex">
        <Button
          onClick={() => {
            url.push("/user/history");
          }}
          color="secondary"
          variant="outlined"
        >
          Đơn đã mua
        </Button>
        <span className="mr-sm"></span>
        <Button
          variant="outlined"
          onClick={() => {
            url.push("/user/cart");
          }}
        >
          Cart {cart.items.length > 0 ? cart.items.length : ""}
        </Button>
        <Button onClick={onLogout}>Signout</Button>
      </div>
    </div>
  );
};
const AdminNav = ({ onLogout }) => {
  const { user } = useSelector((s) => s);
  const url = useHistory();
  return (
    <div className={styles.groupNav}>
      <Button
        onClick={() => {
          url.push("/admin");
        }}
        color="secondary"
        variant="outlined"
      >
        DashBoard
      </Button>
      <div className="right-aligned-flex">
        <Button
          onClick={() => {
            url.push("/admin/orders");
          }}
          color="secondary"
          variant="outlined"
        >
          Quản lý đơn hàng
        </Button>
        <span className="mr-sm"></span>
        <Button
          onClick={() => {
            url.push("/admin/create-product");
          }}
          color="primary"
          variant="outlined"
        >
          Tạo sản phẩm mới
        </Button>
        <Button onClick={onLogout}>Signout</Button>
      </div>
    </div>
  );
};
const PublicNav = () => {
  const url = useHistory();
  return (
    <div>
      <Button
        onClick={() => {
          url.push("/");
        }}
        color="secondary"
        variant="outlined"
      >
        Trang chủ
      </Button>
      <span className="mr-sm"></span>
      <Button
        onClick={() => {
          url.push("/login");
        }}
        color="secondary"
        variant="outlined"
      >
        Login
      </Button>
    </div>
  );
};
