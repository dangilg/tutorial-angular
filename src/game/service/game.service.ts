import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game } from '../model/Game';
import { GAME_DATA } from '../model/mock-games';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {}
    private token:String = this.auth.getToken();
    private baseUrl = 'http://localhost:8080/game';

    private headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
  });

    getGames(title?: string, categoryId?: number): Observable<Game[]> {
        return this.http.get<Game[]>(this.composeFindUrl(title, categoryId));
    }

    saveGame(game: Game): Observable<void> {
        const { id } = game;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;


        return this.http.put<void>(url,game,{headers:this.headers});
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
