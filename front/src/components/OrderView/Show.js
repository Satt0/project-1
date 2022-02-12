import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { FILTER_ORDER } from "api/graphql/query/order";
import moment from "moment";
import styles from "./styles.module.scss";
import { Button } from "@mui/material";
import className from "classnames";
import { CHANGE_ORDER_STATUS } from "api/graphql/mutation/checkout";
import { toast } from "react-toastify";
export default function Show({ type = "user", user_id = -1, filter }) {
  const [callAPI, { error, data, loading }] = useLazyQuery(FILTER_ORDER, {
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    const data = {
      variables: {
        input: {
          offset: 0,
          limit: 30,
          status: filter,
          user_id: type === "user" ? user_id : -4,
        },
      },
    };
    callAPI(data);
  }, [user_id, filter, type]);
  if (loading) return <p>....</p>;
  if (error) return <p>something is broken!</p>;

  if (data) {
    return (
      <div>
        {data.getOrder.map((e) => {
          return (
            <ShowItem
              type={type}
              item={e}
              onSuccessChange={() => {
                const data = {
                  variables: {
                    input: {
                      offset: 0,
                      limit: 30,
                      status: filter,
                      user_id: type === "user" ? user_id : -4,
                    },
                  },
                };
                callAPI(data);
              }}
            />
          );
        })}
      </div>
    );
  }
  return <></>;
}
const getTotalPrice = (arr = [0]) => {
  if (arr.length === 0) return 0;
  return arr.map((e) => e.price).reduce((a, c) => c + a);
};
const ShowItem = ({ type = "user", item, onSuccessChange }) => {
  const [changeStatus, { error, data }] = useMutation(CHANGE_ORDER_STATUS, {
    fetchPolicy: "no-cache",
  });
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (error) {
      return toast("có lỗi khi cập nhật!", { type: toast.TYPE.ERROR });
    }
    if (data) {
      onSuccessChange();
      return toast("cập nhật thành công!", { type: toast.TYPE.SUCCESS });
    }
  }, [error, data]);
  const onChangeStatus = (status = "cho_duyet") => {
    return () => {
      const id = parseInt(item.id);
      return changeStatus({
        variables: {
          input: {
            id,
            status,
          },
        },
      }).catch((e) => {});
    };
  };
  return (
    <div className={styles.Order}>
      <div className={styles.informations}>
        <div>
          {type === "admin" && <p>khách hàng: {item.user.username}</p>}
          <p>ngày {moment(parseInt(item.date_created)).format("DD-MM-YYYY")}</p>
        </div>
        <div>
          <p>Đơn giá: {getTotalPrice(item.items)} VND</p>
        </div>
        <div className="righted-aligned-flex">
          <Button variant="contained" onClick={() => setShow((s) => !s)}>
            Hiện sản phẩm
          </Button>
          <div
            className={className(styles.listProducts, {
              [styles.isShow]: show,
            })}
          >
            <p>Sản phẩm</p>
            <ul>
              {item.items.map((it) => (
                <li>
                  sản phẩm: {it.variant.origin.name}, loại: {it.variant.name},
                  giá:{it.price} VND, sl:{it.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.Buttons}>
        {(item.status === "cho_duyet" || item.status === "da_duyet") && (
          <Button variant="outlined" onClick={onChangeStatus("da_huy")}>
            Hủy
          </Button>
        )}
        {type === "admin" && item.status === "cho_duyet" && (
          <Button variant="outlined" onClick={onChangeStatus("da_duyet")}>
            Xác Nhận
          </Button>
        )}
        {type === "user" && item.status === "da_duyet" && (
          <Button variant="outlined" onClick={onChangeStatus("da_nhan")}>
            Đã Nhận
          </Button>
        )}
        {type === "user" && item.status === "da_huy" && (
          <Button variant="outlined" onClick={onChangeStatus("cho_duyet")}>
            Mua lại
          </Button>
        )}
      </div>
    </div>
  );
};
