import React, { useCallback } from "react";
import ProductForm from "components/ProductForm";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT } from "api/graphql/mutation/products";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useHistory } from "react-router";
export default function CreateProduct(props) {
  const [create, { data, error, loading }] = useMutation(CREATE_PRODUCT, {
    fetchPolicy: "no-cache",
  });
  const url = useHistory();
  const onCreate = useCallback(
    async (newProduct) => {
      // checking;
      if (newProduct.thumb < 0)
        return toast("Chưa chọn ảnh đại diện cho sản phẩm!", {
          type: toast.TYPE.WARNING,
        });
      if (newProduct?.variants?.length <= 0)
        return toast("sản phẩm chưa có chủng loại nào!", {
          type: toast.TYPE.WARNING,
        });
      const input = { ...newProduct };
      input.categories = newProduct.categories.map((e) => parseInt(e.id));
      input.variants = newProduct.variants.map((v={}) => {
        return {
          ...v,
          base_price: parseInt(v.base_price),
          quantity:parseInt(v.quantity),
          discount_price:parseInt(v.discount_price),
          images: v.images.map((i) => parseInt(i.id)),
        };
      });
      
      await create({ variables: { input } });
    },
    [create]
  );
  useEffect(() => {
    if (error)
      return toast("không thể tạo sản phẩm mới!", { type: toast.TYPE.ERROR });
    if (data) {
      toast("tạo sản phẩm mới thành công!", { type: toast.TYPE.SUCCESS });
      const { id } = data.createProduct;
      console.log(id);
      url.push("/admin/edit-product/" + id);
    }
  }, [data, error]);
  return (
    <div>
      <ProductForm type="create" onCreate={onCreate} />
    </div>
  );
}
