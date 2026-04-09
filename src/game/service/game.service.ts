import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game } from '../model/Game';
import { GAME_DATA } from '../model/mock-games';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor() { }

    getGames(title?: string, categoryId?: number): Observable<Game[]> {
        let ret:Game[] = [];
        if(title==undefined && categoryId==null){
          ret = GAME_DATA;
        }
        else{
          GAME_DATA.forEach(element => {
            if(element.category.id==categoryId){
              ret[ret.length] = element;
            }
          });
        }
        return of(ret);
    }

    saveGame(game: Game): Observable<void> {
        return of(null);
    }

}
