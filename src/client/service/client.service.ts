import { Injectable } from "@angular/core";
import { Client } from "../model/client";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DeleteCheckResponse } from "../../core/model/deleteCheckResponse";

//Service que gestiona las peticiones de Cliente con el Backend
@Injectable({
  providedIn: 'root'
})

export class ClientService {

  constructor(
    private http: HttpClient
  ) { }
  private baseUrl = 'http://localhost:8080/client';

  //Obtenemos nextId de SessionStorage
  getNextId(): number {
    return Number(sessionStorage.getItem('clientNextId'));
  }

  //Guardamos nextId en SessionStorage
  setNextId(nextId: number) {
    sessionStorage.setItem('clientNextId', nextId.toString());
  }


  //Petición para obtener la lista de clientes
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  //Petición para ver si un Cliente se puede borrar o no
  isDeleteable(idClient: number): Observable<DeleteCheckResponse> {
    const url = `${this.baseUrl}/${idClient}/can-delete`;
    return this.http.get<DeleteCheckResponse>(url);
  }

  //Petición para el borrado de un Cliente
  deleteClient(idClient: number): Observable<any> {
    const url = `${this.baseUrl}/${idClient}`;
    return this.http.delete(url);
  }

  //Peticición para guardar los datos de un Cliente (creación o edición)
  saveClient(client: Client): Observable<Client> {
    const { id } = client;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;

    return this.http.put<Client>(url, client);

  }
}
