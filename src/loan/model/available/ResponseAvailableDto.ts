import { Client } from "../../../client/model/client";
import { Game } from "../../../game/model/Game";
import { Interval } from "./Interval";

//Clase que define el DTO de la respuesta a la disponibilidad de back
export class ResponseAvailableDto{
  clients:Client[];
  games: Game[];
  validStartDates:Interval[];
  validEndDates:Interval[];
}
