const {gql}=require('apollo-server')

module.exports=gql`
    type User{
        id:Int!
        username:String!
        role:Int!
        last_updated:String!
        date_created:String!
        token:String!
    }
    type SecureUser{
        id:Int!
        username:String!
        last_updated:String!
        date_created:String!
    }

    input LoginInput {
        username:String!
        password:String!
    }
    input SignupInput{
        username:String!
        password:String!
        role:Int!
    }
    extend type Query{
        signIn(input:LoginInput!):User!
    }
    extend type Mutation{
        signUp(input:SignupInput!):User!

    }
    
`