const {gql}=require('apollo-server')

module.exports= gql`
     type Media{
        id:Int!
        url:String!
        type:String!
        date_created:String!
    }
    extend type Query{
         getManyMedia(limit:Int!,offset:Int!):[Media!]!
         getOneMedia(input:Int!):Media!
    }

`