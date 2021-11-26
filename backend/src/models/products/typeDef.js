const {gql}=require('apollo-server')

module.exports= gql`
    type Product{
        id:Int!
        name:String!
        status:String!
        publishing_state:Boolean!
        description:String!
        date_created:String!
        last_updated:String!
        slug:String!
        thumb:Media!
        variants:[Variant]
        categories:[Category!]
    }
    type Variant {
        id:Int!
        name:String!
        base_price:Int!
        quantity:Int!
        is_discount:Boolean!
        discount_price:Int!
        publishing_state:Boolean!
        is_stock:Boolean!
        images:[Media]!
    }
    type Media {
        id:Int!
        url:String!
        type:String!
        date_created:String!
        last_udpated:String!
    }

    input inputProductCreate{
        name:String!
        status:String!
        description:String!
        slug:String!
        thumb:Int!
        categories:[Int]!
        variants:[inputVariant]!
       
    }
    input inputVariant{
       
        name:String!
        base_price:Int!
        quantity:Int!
        is_discount:Boolean!
        discount_price:Int!
        is_stock:Boolean!
        images:[Int]!
    }
    input getProductInput{
        id:Int!
        
       
    }

    input inputUpdateProduct{
        id:Int!
        name:String!
        status:String!
        description:String!
        slug:String!
        thumb:Int!
        categories:[Int]!
        variants:[inputVariant]!

    }
    extend type Mutation{
        createProduct(input:inputProductCreate!):Product!
        updateProduct(input:inputUpdateProduct!):Product!
    }
    extend type Query{
        getProduct(input:getProductInput!):Product!
    }


`