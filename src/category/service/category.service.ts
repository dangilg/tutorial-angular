import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { Category } from '../model/category';
import { CATEGORY_DATA } from '../model/mock-categories';
import { AuthService } from '../../core/service/auth.service';
import { DeleteCheckResponse } from '../../core/model/deleteCheckResponse';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http:HttpClient,

  ) { }

  private baseUrl = 'http://localhost:8080/category';

  getNextId():number{
    const nextIdStr = sessionStorage.getItem('nextCategoryId');
    return Number(nextIdStr);
  }

  setNextId(nextId:number){
    sessionStorage.setItem('nextCategoryId',nextId.toString());
  }


  getCategories(): Observable<Category[]> {
    //return of(CATEGORY_DATA);
    return this.http.get<Category[]>(this.baseUrl);

  }


   saveCategory(category: Category): Observable<Category> {
    const {id} =category;
    const url = id? `${this.baseUrl}/${id}`:this.baseUrl;
    return this.http.put<Category>(url,category);

  }

  deleteCategory(idCategory : number): Observable<any> {
    const url=`${this.baseUrl}/${idCategory}`;
    return this.http.delete(url);
  }

  isDeleteable(idCategory: number):Observable<DeleteCheckResponse>{
    const url = `${this.baseUrl}/${idCategory}/can-delete`;
    return this.http.get<DeleteCheckResponse>(url);
  }
}
