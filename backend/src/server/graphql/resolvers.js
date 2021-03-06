const UserResolver=require('../../models/users/resolvers')
const CategoryResolver=require('../../models/categories/resolvers')
const ProductResolver=require('../../models/products/resolvers')
const MediaResolver=require('../../models/media/resolvers')
const OrderResolver=require('../../models/orders/resolvers')

const {authenticate}=require('../../helpers/authen/resolver')
const defaultResolver = {
    Query: {
        test: authenticate(0,() => "query works!")
    },
    Mutation: {
        test: () => "mutation works!"
    }
}

module.exports = {
    Category:CategoryResolver.root,
    ...ProductResolver.root,
    ...MediaResolver.root,
    ...OrderResolver.root,
    Query: {
        ...defaultResolver.Query,
        ...CategoryResolver.Query,
        ...UserResolver.Query,
        ...ProductResolver.Query,
        ...MediaResolver.Query,
        ...OrderResolver.Query
    },
    Mutation: {
        ...defaultResolver.Mutation,
        ...UserResolver.Mutation,
        ...CategoryResolver.Mutation,
        ...ProductResolver.Mutation,
        ...MediaResolver.Mutation,
        ...OrderResolver.Mutation
    }
}