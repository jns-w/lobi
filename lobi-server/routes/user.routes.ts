import {Hono} from 'hono'

export const userRoutes = new Hono()
  .post("/new", (c) => c.text("new user"))