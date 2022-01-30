import React, { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SINGLE_PRODUCT } from "api/graphql/query/products";
import ProductForm from "components/ProductForm";
import { useCallback } from "react";
import { UPDATE_PRODUCT } from "api/graphql/mutation/products";
import { toast } from "react-toastify";
export default function EditProduct({ match }) {
  const id = parseInt(match?.params?.id ?? 0);
  const [updateProduct, { data: dataUpdate, error: errorUPdate }] = useMutation(
    UPDATE_PRODUCT,
    { fetchPolicy: "no-cache" }
  );

  const { data, error, loading } = useQuery(GET_SINGLE_PRODUCT, {
    fetchPolicy: "no-cache",
    variables: { input: { id } },
  });

  const onUpdate = useCallback(
    (updated) => {
      const {
        id,
        status,
        name,
        description,
        slug,
        thumb,
        variants = [],
        categories = [],
      } = updated;
      const input = {
        id: parseInt(id),
        name,
        status,
        description,
        slug,
        thumb: parseInt(thumb),
        variants: variants.map(
          ({
            name,
            base_price,
            quantity,
            is_discount,
            discount_price,
            is_stock,
            images = [],
          }) => ({
            name,
            base_price: parseInt(base_price),
            quantity:parseInt(quantity),
            is_discount,
            discount_price: parseInt(discount_price),
            is_stock,
            images: images.map((img) => img.id),
          })
        ),
        categories: categories.map((c) => parseInt(c.id)),
      };
      updateProduct({
        variables: { input },
      }).catch(() => {});
    },
    [updateProduct]
  );

  useEffect(() => {
    if (errorUPdate)
      return toast("không thể cập nhật sản phẩm!", { type: toast.TYPE.ERROR });
    if (dataUpdate)
      return toast("Cập nhật sản phẩm thành công!", {
        type: toast.TYPE.SUCCESS,
      });
  }, [dataUpdate, errorUPdate]);
  if (loading) return <p>please wait...</p>;
  if (error) return <p>page not exist</p>;
  if (data) {
    return (
      <div>
        <ProductForm
          type="update"
          preload={data.getProduct}
          onUpdate={onUpdate}
        />
      </div>
    );
  }
}
