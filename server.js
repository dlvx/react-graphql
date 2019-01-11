const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');

require('dotenv').config({
    path: 'variables.env'
});

// DB Schemas (Mongoose)

const Recipe = require('./models/Recipe');
const User = require('./models/User');

// Bring GraphQL-Express middleware

const { graphiqlExpress, graphqlExpress} = require('apollo-server-express');
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');

// GraphQL Schemas/Resolvers

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

// Add mocks, modifies schema in place

// const { mocks } = require('./mocks');

// addMockFunctionsToSchema({ schema, mocks });

// DB Connection

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('DB connected'))
    .catch(e => console.error(e));

// Initialize Server

const app = express();

// CORS configuration

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsOptions))

// Setup JWT authentication middleware

app.use(async (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(token);
    if(token !== "null"){
        try {
            const currentUser = await jwt.verify(token, process.env.SECRET)
            req.currentUser = currentUser
        } catch(e) {
            console.error(e);
        }
    }
    next();
});

// Create GraphiQL application

// app.use('/graphiql', graphiqlExpress({
//     endpointURL: '/graphql'
// }))

// Connect schemas with GraphQL

app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(({ currentUser }) => ({
        schema,
        context: {
            // Pass Mongoose models
            Recipe,
            User,
            currentUser
        }
    }))
);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})