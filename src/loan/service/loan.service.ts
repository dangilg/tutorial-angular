import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../../core/service/auth.service";
import { Pageable } from "../../core/model/page/Pageable";
import { LoanPage } from "../model/LoanPage";
import { Observable } from "rxjs";
import { PageData } from "../../core/model/page/PageData";
import { Loan } from "../model/Loan";
import { LoanDto } from "../model/LoanDto";
import { AvailableDto } from "../model/available/AvailableDto";
import { ResponseAvailableDto } from "../model/available/ResponseAvailableDto";
import { DeleteCheckResponse } from "../../core/model/deleteCheckResponse";

//Service que gestiona las peticiones de Préstamos
@Injectable({
  providedIn: 'root',
})

export class LoanService {
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  private baseUrl = 'http://localhost:8080/loan';




//Peticiçon que obtiene los Prestamos según los filtros
  getLoans(dto:LoanDto):Observable<PageData<Loan>>{

    return this.http.post<PageData<Loan>>(this.baseUrl,dto);
  }

  //Petición que obtiene los datos de dispobibilidad para un préstamos segun sus datos
  getAvailables(dto:AvailableDto):Observable<ResponseAvailableDto>{

    const url = `${this.baseUrl}/available`;
    return this.http.post<ResponseAvailableDto>(url,dto);
  }

  //Petición para guardar un Préstamos
  saveLoan(dto:AvailableDto):Observable<void>{
    const id = dto.loanId;
    const url = id ? `${this.baseUrl}/save/${id}` : `${this.baseUrl}/save`;
    return this.http.put<void>(url,dto);
  }

  //Petición para obtener el último Id
  getLastId():Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/lastId`)
  }

  //Petición para eliminar un prestamo
  delete(id:number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  isDeleteable(id:number):Observable<DeleteCheckResponse>{
    return this.http.get<DeleteCheckResponse>(`${this.baseUrl}/${id}/can-delete`)
  }
}
