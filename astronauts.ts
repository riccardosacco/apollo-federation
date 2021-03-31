import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const port = 4001;

const typeDefs = gql`
  type Astronaut @key(fields: "id") {
    id: ID!
    name: String
  }

  extend type Query {
    astronaut(id: ID!): Astronaut
    astronauts: [Astronaut]
  }
`;

const astronauts = [
  {
    id: 1,
    name: "Neil Armstrong",
  },
];

const resolvers = {
  Astronaut: {
    __resolveReference: (ref) => {
      return astronauts.find((astronaut) => astronaut.id == ref.id);
    },
  },
  Query: {
    astronauts: (_, args) => {
      return astronauts;
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port }).then(({ url }) => {
  console.log(`Astronauts service ready at ${url}`);
});
