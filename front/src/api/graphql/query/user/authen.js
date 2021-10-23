import {gql} from '@apollo/client'

export const USER_LOGIN=gql`
query($input: LoginInput!){
    signIn(input: $input) {
      id
      token
      username
      role
    }
  }
`
export const USER_SIGNUP=gql`
mutation($input: SignupInput!){
    signUp(input: $input) {
      id
      role
      username
      token
    }
  }

`

