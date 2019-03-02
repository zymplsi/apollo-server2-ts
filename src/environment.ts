const defaultPort = 4000;

interface Environment {
  apollo: {
    introspection: boolean;
    playground: boolean;
  };
  port: number | string;

  mongo: {
    url: string
  };
}

export const environment: Environment = {
  apollo: {
    introspection: process.env.APOLLO_INTROSPECTION === 'true',
    playground: process.env.APOLLO_PLAYGROUND === 'true'
  },
  port: process.env.PORT || defaultPort,

  mongo: {
    url: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/graphqldb`
  }
};