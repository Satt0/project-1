import React from "react";
import styles from "./Pagination.module.scss";
import classNames from "classnames";
const genArray = (total = 500, current = 59) => {
  let result = [current];
  let limit = 5,
    left = current,
    right = current;
  while (limit > 0) {
    left -= 1;
    right += 1;
    if (left > 0 && limit > 0) {
      result = [left, ...result];
      limit--;
    }
    if (right <= total && limit > 0) {
      result = [...result, right];
      limit--;
    }
    if (left <= 0 && right > total) break;
  }

  return {
    array: result,
    hasLeft: result[0] > 1,
    hasRight: result[result.length - 1] < total,
  };
};
export default function Pagination({ current = 1, total = 1, onChangePage }) {
  const [page, setPage] = React.useState(genArray(total, current));
  React.useEffect(() => {
    setPage(genArray(total, current));
  }, [total, current]);
  return (
    <div className={styles.container}>
      {page.array.map((p) => (
        <li
          onClick={onChangePage(p)}
          className={classNames({ [styles.cur]: current === p })}
        >
          {p}
        </li>
      ))}
    </div>
  );
}
