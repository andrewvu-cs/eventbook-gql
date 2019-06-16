const express = require('express');
const bodyParser = require('body-parser');
// exports a middleware function
const graphqlHttp = require('express-graphql');
const { buildSchema }= require('graphql');

const app = express();

//temporary solution until database
const events = [];

// parses incoming json data
app.use(bodyParser.json());

// Query for fetching data
// mutation for manipulating data
// You need schema keyword

//Exclamation mark after type = NOT NULLABLE
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    //Resolvers
    //You need resolvers for each unique key
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event);
            return event;
        }
    },
    //allows access to graphql ide
    graphiql: true
    })
);

// port which you visit the page later
app.listen(3000);