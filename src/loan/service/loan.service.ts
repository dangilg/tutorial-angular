import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../../core/service/auth.service";
import { Pageable } from "../../core/model/page/Pageable";
import { LoanPage } from "../model/LoanPage";

@Injectable({
  providedIn: 'root',
})

export class LoanService {
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  //todo lo q hay en este archivo es para borrar despues de la demo
  MOCK_LOAN_LIST: LoanPage = {
    content: [
      {
        id: 1,
        game: {
          id: 1,
          title: 'On Mars',
          age: 14,
          category: {
            id: 1,
            name: 'Eurogames'
          },
          author: {
            id: 2,
            name: 'Vital Lacerda',
            nationality: 'PT'
          }
        },
        client: {
          id: 1,
          name: 'Daniel'
        },
        startDate: '04/04/26',
        endDate: '10/05/26'
      },
      {
        id: 1,
        game: {
          id: 4,
          title: 'Barrage',
          age: 8,
          category: {
            id: 1,
            name: 'Eurogames'
          },
          author: {
            id: 3,
            name: 'Simone Luciani',
            nationality: 'IT'
          }
        },
        client: {
          id: 2,
          name: 'Marcos'
        },
        startDate: '02/04/26',
        endDate: '08/05/26'
      },
    ],
    pageable: {
      pageSize: 5,
      pageNumber: 0,
      sort: [{ property: 'id', direction: 'ASC' }],
    },
    totalElements: 2
  };

  getAuthors() {
    return this.MOCK_LOAN_LIST;
  }
}
