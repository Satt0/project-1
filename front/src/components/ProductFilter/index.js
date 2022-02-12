import React, { useCallback, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { FILTER_PRODUCT } from "api/graphql/query/products";
import Filter from "./Filter";
import Grid from "./Grid";
import Pagination from "./Pagination";
import styles from "./style.module.scss";
import { useEffect } from "react";
import { setIn } from "draft-js/lib/DefaultDraftBlockRenderMap";
export default function ProductFilter({type="admin"}) {
  const [filter, { error, loading, data }] = useLazyQuery(FILTER_PRODUCT, {
    fetchPolicy: "no-cache",
  });
  const [userInput, setInput] = useState({
    name: "",
    page: 1,
    count: 9,
    status: "con_hang",
    // lowerBoundPrice: 0,
    //upperBoundPrice: 99999999999999,
    category: -3,
  });
  useEffect(() => {
    const { category, lowerBoundPrice, upperBoundPrice } = userInput;
    if (
      typeof upperBoundPrice === "number" &&
      typeof lowerBoundPrice === "number" &&
      typeof category === "number"
    ) {
      onFilter(userInput);
    }
  }, [userInput]);
  const onFilter = useCallback(
    ({
      name,
      status,
      lowerBoundPrice = 0,
      upperBoundPrice,
      page = 1,
      count = 5,
      category=-3,
      isAsc=true
    }) => {
      filter({
        variables: {
          input: {
            name,
            status,
            lowerBoundPrice: parseInt(lowerBoundPrice),
            upperBoundPrice: parseInt(upperBoundPrice),
            page: parseInt(page),
            count: parseInt(count),
            category:parseInt(category),
            isAsc
          },
        },
      });
    },
    [filter]
  );
  const onChangePage = useCallback((page) => {
    return () => {
      setInput((old) => ({ ...old, page: parseInt(page) }));
    };
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Filter
          onFilterChange={(update) => {
            setInput((old) => ({ ...old, ...update }));
          }}
        />
        <Grid
        type={type}
          onNameChange={(name) => {
            setInput((old) => ({ ...old, name }));
          }}
          list={data?.filterProduct?.products}
        />
      </div>
      {data && <Pagination onChangePage={onChangePage} current={data.filterProduct.currentPage} total={data.filterProduct.totalPage}/>}
    </div>
  );
}
