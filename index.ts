import { ApolloServer, gql, IResolverObject } from "apollo-server";
import fetch from "node-fetch";
import { RandomUserDataSource } from "./RandomUserDataSource";

const typeDefs = gql`
  type Person {
    gender: String
    email: String
    phone: String
  }

  type Query {
    randomPerson: [Person!]!
    randomPerson2: [Person!]!
  }
`;
////////////////////////////////////////////////////////////////////////////
//example below of 2 requests will only send one request and cache the second////
///////////////////////////////////////////////////////////////////////////

const resolvers: IResolverObject = {
  Query: {
    randomPerson: async () => {
      const response = await fetch("https://api.randomuser.me/");
      const data = await response.json();
      return data.results;
    },
    randomPerson2: async (_, __, { dataSources }) => {
      await dataSources.randomUserAPI.getPerson();
      const realResponse = await dataSources.randomUserAPI.getPerson();
      return realResponse;
    }
  }
};

/////////////////////////////////////
//example below of single request////
////////////////////////////////////

// const resolvers: IResolverObject = {
//   Query: {
//     randomPerson: async () => {
//       const response = await fetch("https://api.randomuser.me/");
//       const data = await response.json();
//       return data.results;
//     },
//     randomPerson2: (_, __, { dataSources }) =>
//       dataSources.randomUserAPI.getPerson()
//   }
// };

/////////////////////////////////////
// invalidate cache(redis, etc)//////
////////////////////////////////////

const randomUserAPI = new RandomUserDataSource();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    randomUserAPI
  })
});

//////////////////////////////////////
// default no cache invalidation/////
/////////////////////////////////////

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   dataSources: () => ({
//     randomUserAPI: new RandomUserDataSource()
//   })
// });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
