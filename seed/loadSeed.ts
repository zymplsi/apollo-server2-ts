import dotenv from 'dotenv';
import mongoose, { Model } from 'mongoose';
import GeoPointsSchema from '../src/db/schemas/geo-points.db.schema';
import { GeoPointDocument } from '../src/db/types/index.types';
import data from './geo-points.json';
import { FeatureCollection } from 'geojson';

dotenv.config();

let featureCollection: FeatureCollection;
const mongoHost = process.env.MONGO_TEST_HOST;
const mongoDb = process.env.MONGO_TEST_DB;
const mongoUrl = `mongodb://${mongoHost}:27017/${mongoDb}`;
const mongoOptions = {
  useNewUrlParser: true,
  useCreateIndex: true
};
const loadSeed = async () => {
  const db = await mongoose.createConnection(mongoUrl, mongoOptions);
  const GeoPointModel: Model<GeoPointDocument> = db.model(
    'geopoints',
    GeoPointsSchema
  );

  const geoPointCollection: FeatureCollection = Object.assign(
    {},
    featureCollection,
    data
  );
  const { features } = geoPointCollection;

  await Promise.all(
    features.map(async ({ properties, geometry }) => {
      try {
        await GeoPointModel.create({ geometry });
      } catch (e) {
        console.error(e);
      }
    })
  );

  const geoPointCollectionCount = await db
    .collection('geopoints')
    .countDocuments();
  console.log(`new record counts: ${geoPointCollectionCount}`);
  await db.close();
  process.exit();
};
loadSeed();
