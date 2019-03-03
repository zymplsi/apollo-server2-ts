import mongoose, { Connection, Model } from 'mongoose';
import { assert } from 'chai';
import GeoPointsSchema from '../../src/db/schemas/geo-points.db.schema';
import { GeoPointDocument } from '../../src/db/types/index.types';

let mongoHost: string | undefined;
let mongoDb: string | undefined;
let mongoUrl: string;
let mongoOptions;
let db: Connection;
let savedGeoPoint: GeoPointDocument;
let GeoPointsModel: Model<GeoPointDocument, {}>;

describe('TEST GEO POINTS', () => {
  before(async () => {
    mongoHost = process.env.MONGO_TEST_HOST;
    mongoDb = process.env.MONGO_TEST_DB;
    mongoUrl = `mongodb://${mongoHost}:27017/${mongoDb}`;
    mongoOptions = {
      useNewUrlParser: true,
      useCreateIndex: true
    };
    db = await mongoose.createConnection(mongoUrl, mongoOptions);
  });

  after(async () => {
    await db.dropDatabase(() => console.log(`${mongoDb} database dropped`));
  });

  beforeEach(() => {
    GeoPointsModel = db.model('geoPoint', GeoPointsSchema);
  });

  describe('Creating a record', () => {
    it('should save a GeoPoint', async () => {
      const geoPoint = new GeoPointsModel({
        name: 'ABC',
        category: 'def',
        location: {
          type: 'Point',
          coordinates: [100.0, 0.0]
        }
      });
      savedGeoPoint = await geoPoint.save();
      assert(!geoPoint.isNew, 'new geoPoint successfully saved!');
    });
  });

  describe('Reading a record', () => {
    it('should read a GeoPoint', async () => {
      const result = await GeoPointsModel.find({ name: 'ABC' });
      assert(savedGeoPoint._id.toString() === result[0]._id.toString());
    });
  });

  describe('Reading a record by id', () => {
    it('should read a GeoPoint of the id', async () => {
      const result = await GeoPointsModel.findOne({ _id: savedGeoPoint._id });
      if (result) {
        const { name } = result.toJSON();
        assert(name === 'ABC');
      } else {
        assert.fail();
      }
    });
  });

  describe('Delete a record by class method', () => {
    it('should delete a GeoPoint', async () => {
      const result = await GeoPointsModel.deleteOne({ name: 'ABC' });
      assert(result.n === 1);
    });
  });
});
