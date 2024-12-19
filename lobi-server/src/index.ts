import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {apiRoutes} from "../routes/api.routes";
import {connectMongo} from "../db/config";
import {setListeners} from "../lib/cleanup";

const app = new Hono()

app.get('/ping', (c) => c.text('Hello Pong!'))

app.use('/api/*', cors({
  origin: ['https://lobi.jonaswong.dev', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['*'],
  exposeHeaders: ['*'],
  credentials: true,
  maxAge: 86400,
}))

app.route("/api", apiRoutes)

connectMongo().catch(console.dir)
setListeners()


export default {
  port: 8080,
  fetch: app.fetch
}
