import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { User } from '../model/User';
import { AuthResponse } from '../model/AuthResponse';

//Service que gestiona las peticiones de autenticación de un usuario.
@Injectable({
  providedIn: 'root'
})


export class AuthModalService{


  constructor(
    private http:HttpClient
  ) { }

  private baseUrl = 'http://localhost:8080/auth';
  private signInUrl ='/signIn';
  private logInUrl ='/logIn';

  //Petición de registro
  sigIn(user:User):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(this.baseUrl+this.signInUrl,user);
  }

  //Petición de inicio de sesión
  logIn(user:User):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(this.baseUrl+this.logInUrl,user);
  }
}
