import { makeExecutableSchema } from 'graphql-tools';
import {
  schema as GeoPointsSchema,
  resolvers as GeoPointsResolvers
} from './geo-points/schema';


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
  Query: {
    testMessage: (): string => {
      return 'Hello World!';

    },
    ...GeoPointsResolvers
  }
};




const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

export default executableSchema;
