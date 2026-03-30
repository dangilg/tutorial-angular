import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category';
import { CATEGORY_DATA } from '../models/mock-categories';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http:HttpClient
  ) { }

  private baseUrl = 'http://localhost:8080/category';

  getCategories(): Observable<Category[]> {
    //return of(CATEGORY_DATA);
    return this.http.get<Category[]>(this.baseUrl);

  }


  //<any> debería er <Category>
   saveCategory(category: Category): Observable<Category> {
    console.log(category);
    const {id} =category;
    const url = id? `${this.baseUrl}/${id}`:this.baseUrl;
    return this.http.put<Category>(url,category);

  }

  deleteCategory(idCategory : number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idCategory}`);
  }
}
