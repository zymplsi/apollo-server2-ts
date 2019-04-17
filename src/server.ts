import 'reflect-metadata';
import express = require('express');
import morgan = require('morgan');
import cors = require('cors');
import passport = require('passport');
import { createConnection, Connection } from 'typeorm';
import { BearerStrategy } from 'passport-azure-ad';
import { ApolloServer } from 'apollo-server-express';
import { environment } from './environment';
import db from './db/mongo/config';
import executableSchema from './gql/schemas/executable-schema';
import AdB2cGraphAPI from './gql/datasources/adb2c-graph.datasource';
import { User } from './db/mssql/entity/User';

const tenantID = 'wwfsghaltproj.onmicrosoft.com';
const clientID = '6d0235c2-54ec-4436-9a50-7bc68f07c8ba';
const policyName = 'b2c_1_susi_std';

const options = {
  identityMetadata:
    'https://wwfsghaltproj.b2clogin.com/' +
    tenantID +
    '/v2.0/.well-known/openid-configuration/',
  clientID: clientID,
  policyName: policyName,
  isB2C: true,
  validateIssuer: true,
  passReqToCallback: false
};

const bearerStrategy = new BearerStrategy(options, function(token, done) {
  // console.log(token);
  // Send user info using the second argument
  done(null, {}, token);
});

const app = express();
app.use(morgan('dev'));

app.use(passport.initialize());
passport.use(bearerStrategy);

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(
  '/api',
  passport.authenticate('oauth-bearer', { session: false }),
  function(req, res, next) {
    var claims = req.authInfo;
    req.user = {
      oid: claims.oid,
      emails: claims.emails,
      name: claims.name
    };
    if (claims['scp'].split(' ').indexOf('read') >= 0) {
      next();
    } else {
      console.log('Invalid Scope, 403');
      res.status(403).json({ error: 'insufficient_scope' });
    }
  }
);

const server = new ApolloServer({
  schema: executableSchema,
  dataSources: () => {
    return {
      adB2cGraphAPI: new AdB2cGraphAPI()
    };
  },
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
  uploads: {
    // Limits here should be stricter than config for surrounding
    // infrastructure such as Nginx so errors can be handled elegantly by
    // graphql-upload:
    // https://github.com/jaydenseric/graphql-upload#type-uploadoptions
    maxFileSize: 10000 * 1000, // 10 MB
    maxFiles: 20
  },
  context: ({ req }) => {
    return req.user;
  }
});

server.applyMiddleware({ app, path: '/api' }); // app is from an existing express app

console.log(__dirname)

createConnection({
  "type": "mssql",
  "host": "haltappdb.database.windows.net",
  "username": "halltapp_db_admin",
  "password": "P@ssword",
  "database": "haltappdevdb",
  "synchronize": true,
  "logging": false,
  "options" : {
     "encrypt" : true
  },
  "entities" : [User]
}
  )
  .then(async (connection: Connection) => {
    db.once('open', () => {
      app.listen({ port: environment.port }, () =>
        console.log(
          `🚀 Connected to database and Server ready at http://localhost:4000${
            server.graphqlPath
          }`
        )
      );
    });

    console.log('Inserting a new user into the database...');
    const user = new User();
    user.firstName = 'Timber';
    user.lastName = 'Saw';
    user.age = 25;
    await connection.manager.save(user);
    console.log('Saved a new user with id: ' + user.id);

    console.log('Loading users from the database...');
    const users = await connection.manager.find(User);
    console.log('Loaded users: ', users);

    // console.log('Here you can setup and run express/koa/any other framework.');
  })
  .catch(error => console.log(error));

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.stop());
}
