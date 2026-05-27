import { Pageable } from "../../core/model/page/Pageable";
import { Loan } from "./Loan";

//Clase que define la estructura de una Page para Préstamos-
export class LoanPage {
  content: Loan[];
  pageable: Pageable;
  totalElements: number;


}
