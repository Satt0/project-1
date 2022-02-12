const {gql}=require('apollo-server')

module.exports= gql`
     type Media{
        id:Int!
        url:String!
        type:String!
        date_created:String!
    }
    input inputMedia{
         limit:Int!
         offset:Int!
    }
    extend type Query{
         getManyMedia(input:inputMedia!):[Media!]!
         getOneMedia(input:Int!):Media!
    }
    extend type Mutation{
         deleteOneMedia(input:Int!):Boolean!
    }

`