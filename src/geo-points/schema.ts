import { coordinatesScalarType } from '../graphql-scalars';
import { GraphQLScalarType } from 'graphql';

export const schema = [
  `
    scalar Coordinates

    type PointGeometry {
        type: String!
        coordinates: Coordinates!
      }
      type PointProps {
        id: Int!
        lat: Float
        lon: Float
      }
      type PointObject {
        type: String!
        geometry: PointGeometry
        properties: PointProps
      }
      type FeatureCollection {
        type: String!
        features: [PointObject]
      }
    

    extend type Query {
     getGeoPointsByCategory: FeatureCollection!
    }    
  `
];

export const typeResolvers = {
  Coordinates: new GraphQLScalarType({
    name: 'Coordinates',
    description: 'A set of coordinates. x, y',
    parseValue(value) {
      return value;
    },
    serialize(value) {
      return value;
    },
    parseLiteral(ast) {
      return ast.kind;
    }
  }),
  PointGeometry: {
    type() {
      return 'Point';
    },
    coordinates(item: { longitude: any; latitude: any; }) {
      return [item.longitude, item.latitude];
    }
  },
  PointProps: {
    id(item) {
      return item.vehicleid;
    },
    lat(item) {
      return item.latitude;
    },
    lon(item) {
      return item.longitude;
    }
  },
  PointObject: {
    type() {
      return 'Feature';
    },
    geometry(item: any) {
      return item;
    },
    properties(item: any) {
      return item;
    }
  },
  FeatureCollection: {
    type() {
      return 'FeatureCollection';
    },
    features(data: any) {
      return data;
    }
  }
};

export const queryResolvers = {
  getGeoPointsByCategory: () => {
    return  []
  }
};
