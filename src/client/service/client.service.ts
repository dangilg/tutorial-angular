import { Injectable } from "@angular/core";
import { Client } from "../model/client";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DeleteCheckResponse } from "../../core/model/deleteCheckResponse";

@Injectable({
  providedIn: 'root'
})

export class ClientService {

  constructor(
    private http: HttpClient
  ) { }
  private baseUrl = 'http://localhost:8080/client';

  getNextId(): number {
    return Number(sessionStorage.getItem('clientNextId'));
  }

  setNextId(nextId: number) {
    sessionStorage.setItem('clientNextId', nextId.toString());
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  isDeleteable(idClient: number): Observable<DeleteCheckResponse> {
    const url = `${this.baseUrl}/${idClient}/can-delete`;
    return this.http.get<DeleteCheckResponse>(url);
  }

  deleteClient(idClient: number): Observable<any> {
    const url = `${this.baseUrl}/${idClient}`;
    return this.http.delete(url);
  }

  saveCategory(client: Client): Observable<Client> {
    const { id } = client;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<Client>(url, client);

  }
}
