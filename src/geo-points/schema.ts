export const schema = [
  `
    extend type Query {
        getGeoPointsByCategory: String!
      }

  `
];

export const resolvers = {
  getGeoPointsByCategory: () => {
    return 'GeoPointsByCategory';
  }
};
