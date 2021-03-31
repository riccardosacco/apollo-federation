import { ApolloServer, gql } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const port = 4002;

const typeDefs = gql`
  type Mission {
    id: ID!
    crew: [Astronaut]
    designation: String!
    startDate: String
    endDate: String
  }

  extend type Query {
    mission(id: ID!): Mission
    missions: [Mission]
  }

  extend type Astronaut @key(fields: "id") {
    id: ID! @external
  }
`;

const missions = [
  {
    id: 1,
    designation: "Apollo 1",
    crew: [1],
  },
];

const resolvers = {
  Query: {
    missions: (_, args) => {
      return missions;
    },
  },
  Mission: {
    crew: (mission) => {
      return mission.crew.map((id) => ({ __typename: "Astronaut", id }));
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port }).then(({ url }) => {
  console.log(`Astronauts service ready at ${url}`);
});
