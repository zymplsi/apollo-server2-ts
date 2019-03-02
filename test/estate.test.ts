import mongoose, { Connection, Model } from 'mongoose';
import { Point } from 'mongoose-geojson-schemas';

import EstateSchema from '../src/db/schemas/estate';
import { assert } from 'chai';

let mongoHost: string | undefined;
let mongoDb: string | undefined;
let mongoUrl: string;
let mongoOptions;
let db: Connection;
let savedEstate: any;

describe('ESTATE', () => {
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

  describe('Creating a record', () => {
    it('should save an Estate', async () => {
      const EstateModel = db.model('estate', EstateSchema);
      const estate = new EstateModel({
        name: 'ABC',
        area: 'def',
        location: {
          type: 'Point',
          coordinates: [100.0, 0.0]
        }
      });
      savedEstate = await estate.save();
      assert(!estate.isNew, 'new estate successfully saved!');
    });
  });

  describe('Reading a record', () => {
    it('should read an Estate', async () => {
      const EstateModel = db.model('estate', EstateSchema);
      const result = await EstateModel.find({ name: 'ABC' });
      assert(savedEstate._id.toString() === result[0]._id.toString());
    });
  });

  describe('Reading a record by id', () => {
    it('should read an Estate of the id', async () => {
      const EstateModel = db.model('estate', EstateSchema);
      const result = await EstateModel.findOne({ _id: savedEstate._id });
      if (result) {
        const { name } = result.toJSON();
        assert(name === 'ABC');
      } else {
        assert.fail();
      }
    });
  });

  describe('Delete a record by class method', () => {
    it('should delete an Estate', async () => {
      const EstateModel = db.model('estate', EstateSchema);
      const result = await EstateModel.deleteOne({ name: 'ABC' });
      assert(result.n === 1)      
    });
  });

});
