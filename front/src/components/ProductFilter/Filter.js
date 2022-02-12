import React, { useState, useEffect } from "react";
import styles from "./Filter.module.scss";
import className from "classnames";
import { Button } from "@mui/material";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ALL_CHILD_CATE } from "api/graphql/query/category";
const maxInt = 2147483647;
export default function Filter({ onFilterChange }) {
  const [filter, setFilter] = useState({
    category: -3,
    lowerBoundPrice: 0,
    upperBoundPrice: maxInt,
    changed: false,
    isAsc: true,
  });

  const onSelectPrice = ({ max = 0, min = 0 }) => {
    setFilter((old) => ({
      ...old,
      lowerBoundPrice: parseInt(min),
      upperBoundPrice: parseInt(max),
      changed: true,
    }));
  };
  const onSelectCategory = (c) => {
    if (parseInt(c) !== filter.category) {
      setFilter((old) => ({
        ...old,
        category: parseInt(c),
        changed: true,
      }));
    }
  };
  useEffect(() => {
    if (filter.changed) {
      onFilterChange(filter);
    }
  }, [filter]);
  useEffect(() => {
    onFilterChange(filter);
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.priceRanges}>
          <div className={styles.priceLabel}>
            <p>Giá</p>
            <Button
              onClick={() => {
                setFilter((old) => ({
                  ...old,
                  isAsc: !old?.isAsc,
                  changed: true,
                }));
              }}
              variant="outlined"
              color={filter.isAsc ? "primary" : "secondary"}
            >
              Giá {filter.isAsc ? "giảm" : "tăng"} dần
            </Button>
          </div>
          <Range onSelect={onSelectPrice} />
        </div>
        <div className={styles.categoryPicker}>
          <p>Danh mục</p>
          <Category onSelect={onSelectCategory} />
        </div>
      </div>
    </div>
  );
}
const defaultRanges = [
  { id: 123, min: 0, max: maxInt, name: "Tất cả" },
  { id: 1, min: 0, max: 100000, name: "dưới 100k" },
  { id: 2, min: 0, max: 500000, name: "dưới 500k" },
  { id: 3, min: 0, max: 1000000, name: "dưới 1 triệu" },
  { id: 4, min: 0, max: 5000000, name: "dưới 5 triệu" },
];
const Range = ({ onSelect }) => {
  const [custom, setCustom] = useState({ id: -1, min: 0, max: 500000 });
  const [selected, setSelected] = useState(defaultRanges[0]);

  const clickHandler = (item) => {
    return (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      setSelected((old) => ({ ...old, ...item }));
      if (item.id !== -1) {
        onSelect(item);
      }
    };
  };
  const customHandler = (key) => {
    return (e) => {
      setCustom((old) => {
        const result = { ...old, [key]: e.target.value };
        return result;
      });
    };
  };
  useEffect(() => {
    let a;
    if (selected.id === -1) {
      a = setTimeout(() => {
        onSelect(custom);
      }, [300]);
    }

    return () => {
      clearTimeout(a);
    };
  }, [selected, custom]);

  return (
    <div>
      {defaultRanges.map((e) => (
        <div key={e.id} className={styles.selectItem} onClick={clickHandler(e)}>
          <input readOnly type="checkbox" checked={selected.id === e.id} />
          <p>{e.name}</p>
        </div>
      ))}
      <div
        onClick={clickHandler(custom)}
        key="custom"
        className={styles.selectItem}
      >
        <input type="checkbox" checked={selected.id === -1} />
        <p>tùy chọn</p>
      </div>
      <form
        className={className(styles.customItem, {
          disabled: selected.id !== -1,
        })}
      >
        <div>
          <p>từ</p>
          <input
            type="number"
            onChange={customHandler("min")}
            step="1"
            min="0"
            value={custom.min}
          />
        </div>
        <div>
          <p>đến</p>
          <input
            type="number"
            onChange={customHandler("max")}
            step="1"
            min="0"
            value={custom.max}
          />
        </div>
      </form>
    </div>
  );
};

const Category = ({ onSelect }) => {
  const { data, loading, error } = useQuery(GET_ALL_CHILD_CATE, {
    variables: {
      input: {
        depth: 0,
      },
    },
  });
  const [selected, setSelected] = useState(-3);
  const clickHandler = (id) => () => {
    onSelect(id);
    setSelected(id);
  };

  if (loading) return <p>...</p>;
  if (error) return <p>error!</p>;
  if (data) {
    return (
      <div className={styles.Category}>
        <Item
          cate={{ id: -3, name: "Tất cả" }}
          selected={selected}
          clickHandler={clickHandler}
        />
        {data.getCategory.map((c) => (
          <Item
            selected={selected}
            key={c.id}
            cate={c}
            clickHandler={clickHandler}
          />
        ))}
      </div>
    );
  }
};

const Item = ({ cate, selected, clickHandler }) => {
  const [getChild, { data }] = useLazyQuery(GET_ALL_CHILD_CATE, {
    variables: {
      input: {
        depth: cate.depth + 1,
        parent_id: cate.id,
      },
    },
    fetchPolicy: "no-cache",
  });
  const [show, setShow] = useState(false);

  return (
    <div className={styles.cateItem}>
      <p>
        <span
          className={className({ [styles.selected]: selected === cate.id })}
          onClick={clickHandler(cate.id)}
        >
          {cate.name} {cate?.count && <span>({cate.count})</span>}
        </span>
        {cate?.child?.length > 0 && (
          <button
            onClick={() => {
              setShow((s) => !s);
              if (!data) {
                getChild({
                  variables: {
                    depth: cate.depth + 1,
                    parent_id: cate.id,
                  },
                });
              }
            }}
          >
            {show ? "hide" : "show"}
          </button>
        )}
      </p>
      {data && (
        <div
          className={className(styles.cateItemChilds, {
            [styles.hidden]: !show,
          })}
        >
          {data.getCategory.map((c) => (
            <Item
              key={c.id}
              cate={c}
              selected={selected}
              clickHandler={clickHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
};
