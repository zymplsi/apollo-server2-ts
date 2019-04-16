import { coordinatesScalarType } from './custom-scalars';

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

const data = [
  { vehicleid: 1, latitude: 40.1, longitude: -76.5 },
  { vehicleid: 2, latitude: 40.2, longitude: -76.6 },
  { vehicleid: 3, latitude: 40.3, longitude: -76.7 }
];

export const typeResolvers = {
  Coordinates: coordinatesScalarType,
  PointGeometry: {
    type() {
      return 'Point';
    },
    coordinates(item: { longitude: any; latitude: any }) {
      return [item.longitude, item.latitude];
    }
  },
  PointProps: {
    id(item: { vehicleid: any }) {
      return item.vehicleid;
    },
    lat(item: { latitude: any }) {
      return item.latitude;
    },
    lon(item: { longitude: any }) {
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
    console.log(data)
    return data;
  }
};
