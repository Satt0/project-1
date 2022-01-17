import {gql} from '@apollo/client'


export const GET_ALL_MEDIA=gql`

query GetManyMedia($input: inputMedia!) {
  getManyMedia(input: $input) {
    id
    url
    type
    date_created
   
  }
}

`