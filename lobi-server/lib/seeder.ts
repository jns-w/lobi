// import data from "../data/locations.json";
import {connectMongo} from "../db/config";
import {ObjectId} from "mongodb";


export async function seed(collection: string, data: any[]) {
  try {
    const db = await connectMongo();
    console.log(`Seeding data to ${collection}`);
    if (!db) throw new Error("Could not connect to db")
    // const res = await db.collection(collection).insertMany(data);
    // console.log(`Seeded ${res.insertedCount} documents to ${collection}`);
    if (!data) throw new Error("No data to seed")
    for (let i = 0; i < data.length; i++) {
      let item = {}
      console.log("Seeding item:", data[i])
      for (const [key, value] of Object.entries(data[i])) {
        if (key === "_id") {
          item = {...item, [key]: new ObjectId(value)}
        } else if (key.substring(key.length - 2) === "Id") {
          item = {...item, [key]: new ObjectId(value)}
        } else if (key === "datetime") {
          item = {...item, [key]: new Date(value)}
        } else {
          item = {...item, [key]: value}
        }
      }
      const res = await db.collection(collection).insertOne(item);
      if (res.acknowledged){
        console.log("Seeded!")
      }
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function exportData(collection: string) {
  try {
    const db = await connectMongo();
    console.log(`Exporting data from ${collection}`);
    if (!db) throw new Error("Could not connect to db")
    const res = await db.collection(collection).find().toArray();
    return res
  } catch (err) {
    console.log(err);
    return false;
  }
}

// export async function seedGames() {
//   try {
//     const db = await connectMongo()
//     if (!db) throw new Error("Could not connect to db")
//     console.log(`Seeding data to games`);
//     const locations = await db.collection('locations').find().toArray();
//
//   } catch (err) {
//     console.log(err)
//   }
// }