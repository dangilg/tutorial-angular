import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN = 'auth_token';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInSubject.asObservable();


  constructor() {

  }


  login(token: string): void {
    sessionStorage.setItem(this.TOKEN, token);
    this.loggedInSubject.next(true);
  }

  logOut(): void {
    sessionStorage.removeItem(this.TOKEN);
    this.loggedInSubject.next(false);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN);
  }


  private hasToken(): boolean {
    return !!sessionStorage.getItem(this.TOKEN);
  }
}
