declare module 'mongoose-geojson-schemas' {
  import {
    Point,
    MultiPoint,
    LineString,
    MultiLineString,
    Polygon,
    MultiPolygon,
    Feature,
    FeatureCollection,
    GeometryCollection
  } from 'geojson';
  export var Point: Point;
  export var MultiPoint: MultiPoint;
  export var LineString: LineString;
  export var MultiLineString: Polygon;
  export var Feature: Feature;
  export var FeatureCollection: FeatureCollection;
  export var GeometryCollection: GeometryCollection;
}
