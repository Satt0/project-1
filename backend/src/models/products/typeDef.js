const {gql}=require('apollo-server')

module.exports= gql`
    type Product{
        id:Int!
        status:String!
        publishing_state:Boolean!
        description:String!
        date_created:String!
        last_updated:String!
        promotion:String!
        slug:String!
        thumb:Media!
        variants:[Variant]
    }
    type Variant {
        id:Int!
        name:String!
        base_price:Int!
        quantity:Int!
        images:[Media]!
    }
    type Media {
        id:Int!
        url:String!
        type:String!
        date_created:String!
    }

    input inputProduct{
        status:String!
        description:String!
        promotion:String!
        slug:String!
        thumb:Int!
        variants:[inputVariant]!
    }
    input inputVariant{
        name:String!
        base_price:Int!
        quantity:Int!
        images:[Int]!
    }
    extend type Mutation{
        createProduct(input:inputProduct!):String!
    }


`