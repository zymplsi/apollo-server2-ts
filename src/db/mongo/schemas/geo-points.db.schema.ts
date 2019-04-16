import { Schema } from 'mongoose';
import { Point, GeometryCollection } from 'mongoose-geojson-schemas';

const GeoPointsSchema = new Schema({
  geometry: Point
});

export default GeoPointsSchema;
