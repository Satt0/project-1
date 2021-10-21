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

    input LoginInput {
        username:String!
        password:String!
    }
    input SignupInput{
        username:String!
        password:String!
        role:Int!
        email:String
        phone:String
    }
    extend type Query{
        signIn(input:LoginInput!):User!
    }
    extend type Mutation{
        signUp(input:SignupInput!):User!

    }
    
`