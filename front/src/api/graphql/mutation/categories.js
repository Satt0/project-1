import { gql } from "@apollo/client";


export const CREATE_CATEGORY=gql`

mutation CreateCategory($input: newCategory!) {
  createCategory(input: $input) {
    id
  }
}

`
export const DELETE_CATEGORY=gql`
mutation DeleteCategory($input: Int!) {
  deleteCategory(input: $input)
}
`
export const UPDATE_CATEGORY=gql`
mutation UpdateCategory($input: oldCategory!) {
  updateCategory(input: $input) {
    id
    name
    slug
    depth
  }
}

`