const {gql}=require('apollo-server')

module.exports= gql`
    type Product{
        id:Int!
        name:Int!
        status:String!
        publishing_state:Boolean!
        description:String!
        date_created:String!
        last_updated:String!
        slug:String!
        thumb:Media!
        variants:[Variant]
        #categories:[Category!]
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

    input inputProduct{
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
        id:Int
        slug:String
        limit:Int!
    }
    extend type Mutation{
        createProduct(input:inputProduct!):Product!
    }
    extend type Query{
        getProduct(input:getProductInput!):[Product!]!
    }


`