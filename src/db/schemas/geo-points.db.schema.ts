import { Schema } from 'mongoose';
import { Point } from 'mongoose-geojson-schemas';

const GeoPointsSchema = new Schema({
  name: { type: String, required: [true, 'name is required'] },
  category: { type: String, required: [true, 'category is required'] },
  location: Point
});

export default GeoPointsSchema;
