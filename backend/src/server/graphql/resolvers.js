const UserResolver=require('../../models/users/resolvers')

const defaultResolver = {
    Query: {
        test: () => "query works!"
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
        ...defaultResolver.Mutation
    }
}