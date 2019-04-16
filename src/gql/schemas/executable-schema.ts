import { makeExecutableSchema } from "graphql-tools";
import {
  schema as GeoPointsSchema,
  typeResolvers as GeoPointsTypeResolvers,
  queryResolvers as GeoPointsQueryResolvers
} from "./geo-points/geo-points.gql.schema";
import {
  schema as Adb2cGraphPhotoSchema,
  typeResolvers as Adb2cGraphPhotoTypeResolvers,
  queryResolvers as Adb2cGraphPhotoQueryResolvers,
  mutationResolvers as Adb2cGraphPhotoMutationResolvers
} from "./adb2c-graph/adb2c-graph-photo.gql.schema";

import {
  schema as Adb2cGraphUserSchema,
  typeResolvers as Adb2cGraphUserTypeResolvers,
  queryResolvers as Adb2cGraphUserQueryResolvers
} from "./adb2c-graph/adb2c-graph-user.gql.schema";

const rootSchema = [
  `
    type Query {
        testMessage: String!
    }

    type Mutation {
      testMessage(name: String): String!
    }

    schema {
      query: Query  
      mutation: Mutation
    }
`
];
const schema = [
  ...rootSchema,
  ...GeoPointsSchema,
  ...Adb2cGraphPhotoSchema,
  ...Adb2cGraphUserSchema
];

const resolvers = {
  ...GeoPointsTypeResolvers,
  ...Adb2cGraphPhotoTypeResolvers,
  ...Adb2cGraphUserTypeResolvers,

  Query: {
    testMessage: (): string => {
      return "Hello World!";
    },
    ...GeoPointsQueryResolvers,
    ...Adb2cGraphPhotoQueryResolvers,
    ...Adb2cGraphUserQueryResolvers
  },

  Mutation: {
    ...Adb2cGraphPhotoMutationResolvers
  }
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

export default executableSchema;
