import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, of } from "rxjs";
import { DeleteCheckResponse } from "../model/deleteCheckResponse";
import { HttpClient, HttpHeaders } from "@angular/common/http";


//Service que gestiona las peticiónes de autenticación del usuario y la gestión del token
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN = 'auth_token';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInSubject.asObservable();


  constructor(
    private http: HttpClient,
  ) {

  }

  //Petición para el Inicio de sesión
  login(token: string): void {
    sessionStorage.setItem(this.TOKEN, `Bearer ${token}`);
    this.loggedInSubject.next(true);
  }

  //Gestiona el cierre de sesión así como el borrado del token
  logOut(): void {
    sessionStorage.removeItem(this.TOKEN);
    sessionStorage.removeItem('author_Next_Id');
    this.loggedInSubject.next(false);
  }

  //Devuelve el token
  getToken(): string | null {

    return sessionStorage.getItem(this.TOKEN);
  }


  //Comprueba si existe un token guardado
  private hasToken(): boolean {
    return !!sessionStorage.getItem(this.TOKEN);
  }

  //Petición que revisa si el token es válidp
  isTokenValid():Observable<boolean>{
    const token = this.getToken();
    if(!token){
      return of(false);
    }
    const url = 'http://localhost:8080/authToken';
    const ruta = '/validateToken';


      return this.http.get(url+ruta,{observe:'response'}).pipe(
        map(()=>true),
        catchError(()=>of(false))
      )
  }
}
