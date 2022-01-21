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
    input newCategory{
        name:String!
        parent_id:Int
        slug:String!
        depth:Int!
    }
    input oldCategory{
        id:Int!
        name:String!
        slug:String!
    }

    extend type Query{
       
        getCategory(input:inputCategory!):[Category!]!
        checkUniqueCategory(input:String!):Boolean!
    }
    extend type Mutation{
        createCategory(input:newCategory!):Category!
        updateCategory(input:oldCategory!):Category!
        deleteCategory(input:Int!):Boolean!
    }

`