require('dotenv').config()

const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');

const  expressConfig=require('./express')


const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

function startApolloServer(typeDefs, resolvers) {
    return async () => {


        const app = express();
        app.use('/rest',expressConfig)
        
        const httpServer = http.createServer(app);
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context:({req})=>{
                const {authorization=""} = req.headers
                
                return {authorization}
            },
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        });
        await server.start();
        server.applyMiddleware({ app });
        await new Promise(resolve => httpServer.listen({ port: process.env.PORT || 4000 }, resolve));
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    }
}

module.exports = startApolloServer(typeDefs, resolvers)