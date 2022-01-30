import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_MEDIA } from "api/graphql/query/media/media";
import styles from "./Gallery.module.scss";
import { useState } from "react";
import { useEffect } from "react";
import classNames from "classnames";
import { getMediaURL } from "helpers/url/images";
import { Button } from "@mui/material";
import { Badge } from "@mui/material";
export default function Gallery({
  onSelect,
  timeStamp,
  type = "single",
  onClose,
}) {
  const { data, error, loading, refetch } = useQuery(GET_ALL_MEDIA, {
    fetchPolicy: "no-cache",
    variables: {
      input: {
        limit: 10,
        offset: 0,
      },
    },
  });
  const [selected, setSelected] = useState([]);

  const clickHandler = (item) => {
   
    if (type === "single") {
      setSelected([item]);
      return;
    }

    if (type === "multiple") {
      setSelected((old) => {
        const foundIndex = old.findIndex((s) => s.id === item.id);
        if (foundIndex >= 0) {
          return [...old.filter((e) => e.id !== item.id)];
        }

        return [...old.filter((e) => e.id !== item.id), item];
      });
      return;
    }
  };
  useEffect(() => {
    if (timeStamp !== 0) {
      refetch();
    }
  }, [timeStamp]);
 
  return (
    <div className={styles.wrapper}>
      <div className={styles.confirmButtons}>
        <Button
          onClick={() => {
            if (selected.length > 0) onSelect(selected);
            onClose();
          }}
          variant="contained"
          color="primary"
        >
          OK
        </Button>
        <Button
          onClick={() => {
            onClose();
          }}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
      </div>
      {loading && <p>loading...</p>}
      {data && (
        <div className={styles.container}>
          {data?.getManyMedia.map((e) => {
            const isFound = selected.findIndex((f) => {
              return f.id === e.id;
            });
            return (
              <div
              key={e.id}
                onClick={() => {
                  clickHandler(e);
                }}
              >
                <ResponsiveImg
                  order={isFound + 1}
                  selected={isFound >= 0}
                  src={e.url}
                />
              </div>
            );
          })}
        </div>
      )}
      <div>
        <Button onClick={()=>{
          refetch(
           {
              input:{
                offset:0,
                limit:10 + data?.getManyMedia?.length ,
              }
            
          })
        }}>More</Button>
      </div>
    </div>
  );
}

const ResponsiveImg = ({ src, selected, order }) => {
  const ref = React.useRef(null);
  const [isBigWidth, setState] = useState(true);
  const loadHandler = (e) => {
    const { offsetHeight: childH } = e.target;
    const { offsetHeight: parentH } = ref.current;
    // if choose big width.

    if (childH > parentH) {
      setState(false);
    } else setState(true);
  };
  return (
    <div
      className={classNames(styles.imgWrapper, { [styles.checked]: selected })}
      ref={ref}
    >
      <div className={styles.badges}>
        <Badge badgeContent={order} color="primary">
          <span></span>
        </Badge>
      </div>
      <img
        className={isBigWidth ? styles.imgWidth : styles.imgHeight}
        onLoad={loadHandler}
        src={getMediaURL(src)}
      />
    </div>
  );
};
