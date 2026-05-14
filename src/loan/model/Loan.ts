import { Client } from "../../client/model/client";
import { Game } from "../../game/model/Game";

export class Loan{
  id:number;
  game:Game;
  client:Client;
  //todo: deberían ser Date, pero las ponemos String para la demo
  startDate:string;
  endDate:string;
}
