const {gql}=require('apollo-server');

// typeDefs
const ProductTypeDef=require('../../models/products/typeDef')
const UserTypeDef=require('../../models/users/typeDef')
const CategoryTypeDef=require('../../models/categories/typeDef')
const MediaTypeDef=require('../../models/media/typeDef')
const OrderTypeDef=require('../../models/orders/typeDef')
const DefaultTypeDef=gql`
   type Query {
       test:String!
   }
   type Mutation{
       test:String!
   }
`

module.exports=[DefaultTypeDef,CategoryTypeDef,UserTypeDef,ProductTypeDef,MediaTypeDef,OrderTypeDef]