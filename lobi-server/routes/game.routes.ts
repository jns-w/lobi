import {Hono} from 'hono'
import {getFeaturedGames, getGames, getUpcomingGames, insertGame, searchGames} from "../db/game-db";

export const gameRoutes = new Hono()
  .get("/all", getGames) // /api/game/all
  .get("/feature", getFeaturedGames) // /api/game/feature
  .get("/upcoming", getUpcomingGames) // /api/game/upcoming
  .post("/", insertGame) // /api/game/
  .get("/search", searchGames) // /api/game/search

