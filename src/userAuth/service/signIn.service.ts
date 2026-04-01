import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})


export class SignInService{


  constructor(
    private http:HttpClient
  ) { }

  private baseUrl = 'http://localhost:8080/auth/signIn';

  sigIn(user:User):Observable<User>{
    return this.http.put<User>(this.baseUrl,user);
  }
}
