import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import Show from "./Show";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";

const userNav = [
  {
    type: "cho_duyet",
    name: "Chờ duyệt",
  },
  {
    type: "da_duyet",
    name: "Đã duyệt",
  },
  {
    type: "da_nhan",
    name: "Đã Giao",
  },
  {
    type: "da_huy",
    name: "Đã hủy",
  },
];
export default function OrderView({ type = "user" }) {
  const [typeOrder, setType] = useState("cho_duyet");
  const user_id=useSelector(s=>s.user.id) ?? -1
  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        {userNav.map((n) => (
          <Button color="primary" variant="outlined" onClick={()=>{
            setType(n.type)
          }}>
            {n.name}
          </Button>
        ))}
      </div>
      <Show type={type} filter={typeOrder} user_id={user_id}/>
    </div>
  );
}
