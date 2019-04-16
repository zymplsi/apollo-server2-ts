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

  aadGraphApi : {
    tenant: string | undefined;
    authorityUrl:string | undefined ;
    applicationId: string | undefined;
    clientSecret: string | undefined;
    resource: string | undefined;
  }
}

export const environment: Environment = {
  apollo: {
    introspection: process.env.APOLLO_INTROSPECTION === 'true',
    playground: process.env.APOLLO_PLAYGROUND === 'true'
  },
  port: process.env.PORT || defaultPort,

  mongo: {
    url: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/graphqldb`
  },
  aadGraphApi : {
    tenant: process.env.AAD_GRAPH_API_TENANT,
    authorityUrl: `${process.env.AAD_GRAPH_API_AUTHORITY_HOST_URL}/${process.env.AAD_GRAPH_API_TENANT}`,
    applicationId: process.env.AAD_GRAPH_API_APPLICATION_ID,
    clientSecret: process.env.AAD_GRAPH_API_CLIENT_SECRET,
    resource: process.env.AAD_GRAPH_API_RESOURCE
  }
};
