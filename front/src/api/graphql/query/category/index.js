import { gql } from "@apollo/client"
export const GET_ALL_CHILD_CATE=gql`
query getCateory($input: inputCategory!){
  getCategory(input: $input) {
    id
    name
    count
    child {
      id
    }
    slug
    depth
  }
}
`
export const CHECK_SLUG_CATEGORY=gql`
query Query($input: String!) {
  checkUniqueCategory(input: $input)
}
`