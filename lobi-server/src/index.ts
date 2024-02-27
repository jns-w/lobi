import { Hono } from 'hono'
import {apiRoutes} from "../routes/api.routes";
import {connectMongo} from "../db/config";
import {setListeners} from "../lib/cleanup";
import {exportData, seed} from "../lib/seeder";

const app = new Hono()

app.get('/ping', (c) => c.text('Hello Pong!'))

app.route("/api", apiRoutes)
// app.route("/admin", adminRoutes)

connectMongo().catch(console.dir)
setListeners()

// DATA SEEDING
// GAMES SEED
// const f = Bun.file('./data/games.json', {type: 'application/json'})
// const data = await f.text().then(t => JSON.parse(t))
//
// await seed('games', data.games)

// FACILITIES SEED
// const f = Bun.file('./data/facilities.json', {type: 'application/json'})
// const data = await f.text().then(t => JSON.parse(t))
//
// await seed('facilities', data.facilities)

// DATA EXPORT
//export facilities
// const res = await exportData('facilities').catch(console.dir)
//
// const f = await Bun.file('./output/output.json', {type: 'application/json'})
// const w = await Bun.write(f, JSON.stringify(res, null, 2))
// if (w) console.log('done');

export default {
  port: 8080,
  fetch: app.fetch
}
