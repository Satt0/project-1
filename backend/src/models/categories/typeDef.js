const {gql}=require('apollo-server')

module.exports= gql`
    type Category{
        id:Int!
        name:String!
        parent:Category
        child:[Category!]
        slug:String!
        depth:Int!
    }
    input inputCategory{
        depth:Int!
        parent_id:Int
    }
    extend type Query{
       
        getCategory(input:inputCategory!):[Category!]!
    }

`