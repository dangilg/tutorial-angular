import { Client } from "../../../client/model/client";
import { Game } from "../../../game/model/Game";
import { Interval } from "./Interval";

export class ResponseAvailableDto{
  clients:Client[];
  games: Game[];
  validStartDates:Interval[];
  validEndDates:Interval[];
}
