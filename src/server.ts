import { ApolloServer } from 'apollo-server';
import { environment } from './environment';
import db from './db/config';
import executableSchema from './graphql-schema';

const server = new ApolloServer({
  schema: executableSchema,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground
});

db.once('open', () => {
  server.listen(environment.port).then(({ url }) => {
    console.log(`Connected to database and server ready at ${url}. `);
  });
});

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.stop());
}
