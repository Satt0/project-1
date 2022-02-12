const {gql}=require('apollo-server')

module.exports= gql`
    type Order{
        id:Int!
        user:SecureUser!
        date_created:String!
        status:String!
        items:[OrderItem!]!
    }
    type OrderItem{
        quantity:Int!
        price:Int!
        variant:Variant!
    }
    input inputGetOrder{
        offset:Int!
        status:String!
        limit:Int!
        user_id:Int!
    }
    extend type Query{
        
        getOrder(input:inputGetOrder!):[Order!]
    }
    input inputOrderItem{
        quantity:Int!
        product_id:Int!
        price:Int!
    }
    input inputCreateOrder{
        user:Int!   
        items:[inputOrderItem!]!
    }
    input inputUpdateOrder{
        id:Int!
        status:String!
    }
    extend type Mutation{
        createOrder(input:inputCreateOrder!):Order!
        updateOrder(input:inputUpdateOrder!):Order!
       
    }
`