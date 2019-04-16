export const schema = [
  `
  type User {
    city:  String 
    country: String 
    displayName: String 
    givenName: String
    postalCode: String
    email: String
    preferredLanguage: String
    state : String
    streetAddress: String

  }

  extend type Query {
    user: User
  }

`
];
export const typeResolvers = {};
export const queryResolvers = {
  user: async (_: any, args: any, { oid, dataSources }: any) => {
    const getUserResult = await dataSources.adB2cGraphAPI.getUser(oid);
    

    const {
      city,
      country,
      displayName,
      givenName,
      postalCode,
      signInNames,
      preferredLanguage,
      state,
      streetAddress,
    } = getUserResult;

    const email = signInNames[0].value

    return {
      city,
      country,
      displayName,
      givenName,
      email,
      postalCode,
      preferredLanguage,
      state,
      streetAddress,
    };
  }
};
