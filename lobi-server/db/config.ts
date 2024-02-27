import {Db, MongoClient} from 'mongodb';

const uri = process.env.MONGOURI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db: Db;

export async function connectMongo(): Promise<Db | undefined> {
  try {
    console.log("Connecting to db...")
    await client.connect()
    const res = await client.db('lobi').command({ping: 1})
    if (!res.ok) throw new Error("Could not connect to db");
    db = await client.db('lobi');
    console.log(`Connected successfully to mongo`);
    return db;
  } catch (err) {
    throw err;
  }
}

export function getDb(): Db | undefined {
  return db;
}

export async function closeMongo() {
  try {
    await client.close();
    console.log("Closed db connection");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}