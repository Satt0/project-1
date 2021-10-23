const UserResolver=require('../../models/users/resolvers')
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
    Query: {
        ...defaultResolver.Query,
        ...UserResolver.Query
    },
    Mutation: {
        ...defaultResolver.Mutation,
        ...UserResolver.Mutation
    }
}