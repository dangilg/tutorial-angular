import { Client } from "../../client/model/client";
import { Game } from "../../game/model/Game";

export class Loan{
  id:number;
  game:Game;
  client:Client;

  startDate:string;
  endDate:string;
}
