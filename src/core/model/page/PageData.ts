import { Pageable } from "./Pageable";

import { Author } from "../../../author/model/Author";

//Clase Genérica que contiene los datos de una Page.
export class PageData<T> {
  //Lista de elementos de tipo Genérico
  content: T[];
  //Objeti Pageable
  pageable: Pageable;

  totalElements: number;
}
