import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../../core/model/page/Pageable';
import { Author } from '../model/Author';
import { AuthorPage } from '../model/AuthorPage';
import { AUTHOR_DATA } from '../model/mock-authors';
import { AUTHOR_DATA_LIST } from '../model/mock-author-list';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DeleteCheckResponse } from '../../core/model/deleteCheckResponse';
import { AuthService } from '../../core/service/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthorService {
    constructor(
      private http: HttpClient,
      private auth:AuthService
    ) {}

    private baseUrl = 'http://localhost:8080/author';
    private token = this.auth.getToken();



    getAuthors(pageable: Pageable): Observable<AuthorPage> {
        return this.http.post<AuthorPage>(this.baseUrl, { pageable: pageable });
    }

    saveAuthor(author: Author): Observable<Author> {
        //console.log("token");
        //console.log(this.token);
        const { id } = author;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Author>(url, author);
    }

    deleteAuthor(idAuthor: number): Observable<void> {
      const url = `${this.baseUrl}/${idAuthor}`;
        return this.http.delete<void>(url);
    }

    getAllAuthors(): Observable<Author[]> {
        return this.http.get<Author[]>(this.baseUrl);
    }
    isDeleteable(idAuthor:number):Observable<DeleteCheckResponse>{
      const url = `${this.baseUrl}/${idAuthor}/can-delete`
      return this.http.get<DeleteCheckResponse>(url);
    }

}
