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

@Injectable({
  providedIn: 'root',
})

export class LoanService {
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  private baseUrl = 'http://localhost:8080/loan';





  getLoans(dto:LoanDto):Observable<PageData<Loan>>{

    return this.http.post<PageData<Loan>>(this.baseUrl,dto);
  }

  getAvailables(dto:AvailableDto):Observable<ResponseAvailableDto>{
    console.log('estoy en getAvailables');
    const url = `${this.baseUrl}/available`;
    return this.http.post<ResponseAvailableDto>(url,dto);
  }

  saveLoan(dto:AvailableDto):Observable<void>{
    const id = dto.loanId;
    const url = id ? `${this.baseUrl}/save/${id}` : `${this.baseUrl}/save`;
    console.log('saveLoan');
    console.log(url);
    console.log(dto)
    return this.http.put<void>(url,dto);
  }

  getCount():Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/count`)
  }
}
