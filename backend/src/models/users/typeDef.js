const {gql}=require('apollo-server')

module.exports=gql`
    type User{
        id:Int!
    }
    extend type Query{
        testUser:String!
    }
    
`