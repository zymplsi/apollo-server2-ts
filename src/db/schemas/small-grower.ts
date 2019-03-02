import { Schema, model } from 'mongoose';
import { Point } from 'mongoose-geojson-schemas';

export const SmallGrower = new Schema({
  name: { type: String, required: true },
  area: { type: String, required: true },
  location: { type: Point, required: true }
});

