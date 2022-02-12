import { gql } from "@apollo/client";

export const CHECK_PRODUCT_SLUG=gql`
query Query($input: String!) {
  checkProductSlug(input: $input)
}
`

export const GET_SINGLE_PRODUCT=gql`
query GetProduct($input: getProductInput!) {
  getProduct(input: $input) {
    id
    name
    status
    publishing_state
    description
    date_created
    last_updated
    slug
    thumb {
      id
      url
      type
      date_created
     
    }
    variants {
      id
      name
      base_price
      quantity
      is_discount
      discount_price
      publishing_state
      is_stock
      images {
        id
        url
        type
        date_created
      }
    }
    categories {
      id
      name
      slug
      depth
    }
  }
}
`
export const FILTER_PRODUCT=gql`
query FilterProduct($input: inputFilterProduct!) {
  filterProduct(input: $input) {
    currentPage
   totalPage
   products {
     id
     base_price
     name
     is_discount
     is_stock
     quantity
     discount_price
     is_discount
     origin {
       id
       name
       slug
       status
       thumb{
         id
         url
       }
       
     }
   }
  }
}
`