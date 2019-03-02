import mongoose, { ConnectionOptions, Model, Document } from 'mongoose';
import { environment } from '../environment';
import EstateSchema  from './schemas/estate';

const mongoOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
};
const mongodbUri = environment.mongo.url;
mongoose.set('debug', process.env.NODE_ENV !== 'production');
const db = mongoose.createConnection(mongodbUri, mongoOptions);

db.on('error', err => {
  console.warn(`${err}, db connectionn error!`, { label: 'startup' });
});

db.once('open', () => {
  console.info('db connection success...', { label: 'startup' });
});

try {
  db.model('estate');
} catch (e) {
  db.model('estate', EstateSchema);
}
export default db;
