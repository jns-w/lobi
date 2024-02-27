import {Hono} from "hono"
import {gameRoutes} from "./game.routes";
import {userRoutes} from "./user.routes";
import {facilityRoutes} from "./facility.routes";

export const apiRoutes = new Hono()
  .route("/game", gameRoutes)
  .route("/user", userRoutes)
  .route("/facility", facilityRoutes)