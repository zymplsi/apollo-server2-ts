import { Schema, model } from 'mongoose';
import { Point } from 'mongoose-geojson-schemas';

const EstateSchema = new Schema({
  name: { type: String, required: [true, 'name is required'] },
  area: { type: String, required: [true, 'area is required'] },
  location: Point
});

export default EstateSchema;
