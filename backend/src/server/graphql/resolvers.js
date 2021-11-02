const UserResolver=require('../../models/users/resolvers')
const CategoryResolver=require('../../models/categories/resolvers')
const ProductResolver=require('../../models/products/resolvers')

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
    Query: {
        ...defaultResolver.Query,
        ...CategoryResolver.Query,
        ...UserResolver.Query,
        ...ProductResolver.Query
    },
    Mutation: {
        ...defaultResolver.Mutation,
        ...UserResolver.Mutation,
        ...CategoryResolver.Mutation,
        ...ProductResolver.Mutation
    }
}