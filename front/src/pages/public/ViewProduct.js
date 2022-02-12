import React from "react";
import { GET_SINGLE_PRODUCT } from "api/graphql/query/products";
import { useQuery } from "@apollo/client";
import ProductUserView from "components/ProductUserView";
export default function ViewProduct({ match: { params } }) {
  const { slug } = params;
  const { data, error, loading } = useQuery(GET_SINGLE_PRODUCT, {
    variables: {
      input: {
        id: 0,
        slug,
      },
    },
  });
  if (loading) return <p>....</p>;
  if (data) {
 
    return <ProductUserView product={data?.getProduct}/>;
  }
}
