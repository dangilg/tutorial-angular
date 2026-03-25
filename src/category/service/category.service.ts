import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category';
import { CATEGORY_DATA } from '../models/mock-categories';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() { }

  getCategories(): Observable<Category[]> {
    return of(CATEGORY_DATA);
  }


  //<any> debería er <Category>
   saveCategory(category: Category): Observable<any> {
    //habrá que detectar cuando se está creando una nueva y cuando se está editando
    //seguramnte en el backend, con una petición a la BD
    console.log('src/category/service/category.service.ts [saveCategory]: guardado de categoria')
    return of(null);
  }

  deleteCategory(idCategory : number): Observable<any> {
    console.log(`src/category/service/category.service.ts [deleteategory]: borrado de categoria con id ${idCategory}`)
    return of(null);
  }
}
