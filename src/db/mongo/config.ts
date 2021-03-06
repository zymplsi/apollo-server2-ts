import mongoose = require("mongoose");
import { environment } from "../../environment";
import GeoPointsSchema from "./schemas/geo-points.db.schema";

const mongoOptions = {
  useNewUrlParser: true,
  useCreateIndex: true
};
const mongodbUri = environment.mongo.url;
mongoose.set("debug", process.env.NODE_ENV !== "production");
const db = mongoose.createConnection(mongodbUri, mongoOptions);

db.on("error", err => {
  console.warn(`${err}, db connectionn error!`, { label: "startup" });
});

db.once("open", () => {
  console.info("db connection success...", { label: "startup" });
});

try {
  db.model("geopoints");
} catch (e) {
  db.model("geopoints", GeoPointsSchema);
}
export default db;
