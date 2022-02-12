import { gql } from "@apollo/client";

export const CHECKOUT_CART=gql`
mutation CreateOrder($input: inputCreateOrder!) {
  createOrder(input: $input) {
    id
  }
}

`
export const CHANGE_ORDER_STATUS=gql`
mutation UpdateOrder($input: inputUpdateOrder!) {
  updateOrder(input: $input) {
    id
    status
  }
}
`