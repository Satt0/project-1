import {gql} from '@apollo/client'

export const CREATE_PRODUCT=gql`
mutation CreateProduct($input: inputProductCreate!) {
  createProduct(input: $input) {
    id
    name
    status
    publishing_state
    description
  }
}
`
export const UPDATE_PRODUCT=gql`
mutation UpdateProduct($input: inputUpdateProduct!) {
  updateProduct(input: $input) {
    id
  }
}
`