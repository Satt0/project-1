import { gql } from "@apollo/client";

export const FILTER_ORDER=gql`
query GetOrder($input: inputGetOrder!) {
  getOrder(input: $input) {
    id
    user {
      username
      id
    }
    date_created
    status
    items {
      quantity
      price
      variant {
        id
        name
        base_price
        quantity
        is_discount
        discount_price
        is_stock
        images {
          url
          id
          type
        }
        origin {
          name
          slug
          thumb {
            url
            id
          }
        }
      }
    }
  }
}
`