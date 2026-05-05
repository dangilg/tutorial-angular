import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../../core/service/auth.service";
import { Pageable } from "../../core/model/page/Pageable";
import { LoanPage } from "../model/LoanPage";
import { Observable } from "rxjs";
import { PageData } from "../../core/model/page/PageData";
import { Loan } from "../model/Loan";
import { LoanDto } from "../model/LoanDto";

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
    console.log(dto);
    return this.http.post<PageData<Loan>>(this.baseUrl,dto);
  }
}
