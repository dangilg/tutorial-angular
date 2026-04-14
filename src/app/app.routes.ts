import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'category',
    loadComponent:()=>import('../category/category-list/category-list.component').then(m=> m.CategoryListComponent)
  },
  {
    path:'authors',
    loadComponent:()=>import('../author/author-list/author-list.component').then(m=>m.AuthorListComponent)
  },
  {
    path:'games',
    loadComponent:()=>import('../game/game-list/game-list.component').then(m=>m.GameListComponent)
  },
  {
    path:'',
    loadComponent:()=>import('../game/game-list/game-list.component').then(m=>m.GameListComponent)
  }
];
