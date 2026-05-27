import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game } from '../model/Game';
import { GAME_DATA } from '../model/mock-games';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/service/auth.service';

//Service que gestiona las peticiones al Backend de los Juegos
@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }
  private token = this.auth.getToken();
  private baseUrl = 'http://localhost:8080/game';


  //Guardamos el nextId en SessionStorage
  setNextGameId(nextId: number) {
    sessionStorage.setItem('nextGameId', nextId.toString());
  }

  //Obtenemos el nextId de SessionStorage.
  getNextGameId(): number {
    return Number(sessionStorage.getItem('nextGameId'));
  }

  //Petición que nos devuelve la lista de Juegos, en relación a los filtros (Título del Juego e id de la Categoria)
  getGames(title?: string, categoryId?: number): Observable<Game[]> {
    return this.http.get<Game[]>(this.composeFindUrl(title, categoryId));
  }

  //Petición de guardado de un Juego
  saveGame(game: Game): Observable<void> {
    const { id } = game;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;


    return this.http.put<void>(url, game);
  }

  private composeFindUrl(title?: string, categoryId?: number): string {
    const params = new URLSearchParams();
    if (title) {
      params.set('title', title);
    }
    if (categoryId) {
      params.set('idCategory', categoryId.toString());
    }
    const queryString = params.toString();
    return queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
  }
}
