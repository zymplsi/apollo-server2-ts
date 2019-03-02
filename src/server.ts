import { ApolloServer } from 'apollo-server';
import { environment } from './environment';
import db from './db/config';
import resolvers from './resolvers';
import typeDefs from './schemas';

const server = new ApolloServer({
  resolvers,
  typeDefs,
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
