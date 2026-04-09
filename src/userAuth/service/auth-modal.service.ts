import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { User } from '../model/User';
import { AuthResponse } from '../model/AuthResponse';

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

  sigIn(user:User):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(this.baseUrl+this.signInUrl,user);
  }

  logIn(user:User):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(this.baseUrl+this.logInUrl,user);
  }
}
