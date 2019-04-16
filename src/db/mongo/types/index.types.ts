import { Document } from 'mongoose';
import { Point } from 'geojson';

export interface GeoPointDocument extends Document {
  geometry: Point;
}
