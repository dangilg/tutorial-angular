import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../../core/model/page/Pageable';
import { Author } from '../model/Author';
import { PageData } from '../../core/model/page/PageData';
import { AUTHOR_DATA } from '../model/mock-authors';
import { AUTHOR_DATA_LIST } from '../model/mock-author-list';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DeleteCheckResponse } from '../../core/model/deleteCheckResponse';
import { AuthService } from '../../core/service/auth.service';

//Service de Autor. Lanzamos las peticiones al backend.
@Injectable({
    providedIn: 'root',
})
export class AuthorService {
    constructor(
      private http: HttpClient,
      private auth:AuthService
    ) {}

    private baseUrl = 'http://localhost:8080/author';



    //Petición que devuelve todos los elementos de la BD, en forma paginada.
    getAuthors(pageable: Pageable): Observable<PageData<Author>> {

        return this.http.post<PageData<Author>>(this.baseUrl, { pageable: pageable });
    }

    //Petición de guardado del Autor en el backend
    saveAuthor(author: Author): Observable<Author> {
        const { id } = author;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Author>(url, author);
    }

    //Petición de borrado del Autor en el backend
    deleteAuthor(idAuthor: number): Observable<void> {
      const url = `${this.baseUrl}/${idAuthor}`;
        return this.http.delete<void>(url);
    }

    //Petición que devuelve una lista con todos los Autores.
    getAllAuthors(): Observable<Author[]> {
        return this.http.get<Author[]>(this.baseUrl);
    }

    //Petición para comprobar si un Autor es borrable o no.
    isDeleteable(idAuthor:number):Observable<DeleteCheckResponse>{
      const url = `${this.baseUrl}/${idAuthor}/can-delete`
      return this.http.get<DeleteCheckResponse>(url);
    }

}
