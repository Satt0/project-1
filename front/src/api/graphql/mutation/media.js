import { gql } from "@apollo/client";

export const DELETE_ONE_MEDIA=gql`
mutation DeleteOneMedia($input: Int!) {
  deleteOneMedia(input: $input)
}
`