import React, { useEffect, useState } from "react";
import styles from "./Images.module.scss";
import ImageGallery from "react-image-gallery";
import { getMediaURL } from "helpers/url/images";
const images = [
  {
    original: "https://picsum.photos/id/1018/1000/600/",
    thumbnail: "https://picsum.photos/id/1018/250/150/",
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
  },
];
const getCarousel = ({ thumb, collections = [], selectedVariant = -1 }) => {
  let thumbOnly = {
    original: getMediaURL(thumb.url),
    thumbnail: getMediaURL(thumb.url),
  };
  if (selectedVariant < 0) {
    let result = [thumbOnly];
    collections.forEach((v) => {
      v.images.forEach((img) =>
        result.push({
          original: getMediaURL(img.url),
          thumbnail: getMediaURL(img.url),
        })
      );
    });

    return result;
  } else {
    const vImages = collections
      .find((e) => e.id === selectedVariant)
      .images.map((i) => ({
        original: getMediaURL(i.url),
        thumbnail: getMediaURL(i.url),
      }));
    if (vImages.length <= 0) {
      return [thumbOnly];
    }
    return vImages;
  }
};
export default function Images({
  thumb = {},
  collections = [],
  selectedVariant = -1,
}) {
  const [src, setSrc] = useState([]);
  useEffect(() => {
    setSrc(getCarousel({ thumb, collections, selectedVariant }));
  }, [thumb, collections, selectedVariant]);
  return (
    <div className={styles.container}>
      <ImageGallery
      lazyLoad={true}
       
        originalHeight={500}
        items={src}
      />
    </div>
  );
}
