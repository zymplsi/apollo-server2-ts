import { makeExecutableSchema } from 'graphql-tools';
import {
  schema as GeoPointsSchema,
  typeResolvers as GeoPointsTypeResolvers,
  queryResolvers as GeoPointsQueryResolvers
} from '../gql/geo-points/schema';
import { GraphQLScalarType } from 'graphql';

const rootSchema = [
  `
    type Query {
        testMessage: String!
    }

    schema {
        query: Query
    }
`
];
const schema = [...rootSchema, ...GeoPointsSchema];

const resolvers = {
  ...GeoPointsTypeResolvers,

  Query: {
    testMessage: (): string => {
      return 'Hello World!';
    },
    ...GeoPointsQueryResolvers
  }
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

export default executableSchema;
