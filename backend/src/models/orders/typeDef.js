const {gql}=require('apollo-server')

module.exports= gql`
    type Product{
        id:Int!
    }
    extend type Query{
        createProduct
    }

`