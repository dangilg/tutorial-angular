import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { Category } from '../model/category';
import { CATEGORY_DATA } from '../model/mock-categories';
import { AuthService } from '../../core/service/auth.service';
import { DeleteCheckResponse } from '../../core/model/deleteCheckResponse';

//Service de gestión de Categorías
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,

  ) { }

  private baseUrl = 'http://localhost:8080/category';

  //Obtenemos el nextId de SessionStorage
  getNextId(): number {
    const nextIdStr = sessionStorage.getItem('nextCategoryId');
    return Number(nextIdStr);
  }

  //Guardamos el nextId en SessionStorage
  setNextId(nextId: number) {
    sessionStorage.setItem('nextCategoryId', nextId.toString());
  }

  //Petición que obtiene toda la lista de Categorías
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);

  }

  //Petición para guardar una Categoría
  saveCategory(category: Category): Observable<Category> {
    const { id } = category;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<Category>(url, category);

  }

  //Petición para borrar una Categoría
  deleteCategory(idCategory: number): Observable<any> {
    const url = `${this.baseUrl}/${idCategory}`;
    return this.http.delete(url);
  }

  //Petición para comprobar si una Categoría se puede borrar o no
  isDeleteable(idCategory: number): Observable<DeleteCheckResponse> {
    const url = `${this.baseUrl}/${idCategory}/can-delete`;
    return this.http.get<DeleteCheckResponse>(url);
  }
}
