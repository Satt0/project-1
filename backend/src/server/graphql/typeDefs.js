const {gql}=require('apollo-server');

// typeDefs
const ProductTypeDef=require('../../models/products/typeDef')
const UserTypeDef=require('../../models/users/typeDef')

const DefaultTypeDef=gql`
   type Query {
       test:String!
   }
   type Mutation{
       test:String!
   }
`

module.exports=[DefaultTypeDef,ProductTypeDef,UserTypeDef]