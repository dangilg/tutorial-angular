import { Component, OnInit, signal } from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/client';
import { Loan } from '../model/Loan';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/service/auth.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LoanService } from '../service/loan.service';
import { ClientService } from '../../client/service/client.service';
import { GameService } from '../../game/service/game.service';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import moment, { Moment } from 'moment';
import { Pageable } from '../../core/model/page/Pageable';
import { FilterDataModel } from '../model/FilterDataModel';
import { SortPage } from '../../core/model/page/SortPage';

import { editCreateDataModel } from '../../core/model/editCreateDataModel';
import { MatDialog } from '@angular/material/dialog';
import { LoanEditComponent } from '../loan-edit/loan-edit.component';


@Component({
  standalone: true,
  selector: 'app-loan-list',

  imports: [
    MatFormField,
    MatLabel,
    MatSelectModule,
    MatOption,
    MatSuffix,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginator
  ],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss',
})
export class LoanListComponent implements OnInit {

  filterGame: Game = null;
  filterClient: Client = null;


  filterDate: Moment = moment();

  games: Game[];
  clients: Client[];

  loansList = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'game', 'client', 'startDate', 'endDate', 'action'];

  isLoggedIn$ = this.authService.isLoggedIn$;

  pageNumber = signal(0);
  pageSize: number = 5;

  totalElements = signal(0);

  sort: SortPage = {
    property: 'id',
    direction: 'ASC'
  }

  nextId = signal<number>(-1);

  constructor(
    private authService: AuthService,
    private loanService: LoanService,
    private clientService: ClientService,
    private gameServie: GameService,
    private dialog: MatDialog,

  ) {

  }

  ngOnInit(): void {
   this.loanService.getCount().subscribe(count=>{
    this.nextId.set(count+1);
   });

    this.clientService.getClients().subscribe(
      clients => {
        this.clients = clients;
      }

    )

    this.gameServie.getGames().subscribe(
      games => {
        this.games = games;
      }
    )

    this.getLoans();



  }

  getLoans(event?: PageEvent) {
    const pageable: Pageable = this.getPageable(event);
    const filters: FilterDataModel = this.getFilters();
    this.loanService.getLoans({
      pageable: pageable,
      filters: filters
    }).subscribe(
      (data) => {
        console.log(data);
        this.loansList.data = data.content;
        console.log(this.loansList.data);



        if (this.loansList.data.length == 0 && pageable.pageNumber != 0) {
          const evt: PageEvent = {
            pageIndex: pageable.pageNumber - 1,
            previousPageIndex: pageable.pageNumber,
            pageSize: pageable.pageSize,
            length: data.totalElements
          }
          this.getLoans(evt);
        }
        else {
          this.pageNumber.set(data.pageable.pageNumber);
          this.pageSize = data.pageable.pageSize;
          this.totalElements.set(data.totalElements);
        }




      }
    );

  }

  getPageable(event?: PageEvent): Pageable {
    const pageable: Pageable = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize,
      sort: [
        {
          property: 'startDate',
          direction: 'ASC'
        },
      ],
    };

    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }

    return pageable;
  }

  getFilters(): FilterDataModel {
    return {
      gameId: this.filterGame != null ? this.filterGame.id : null,
      clientId: this.filterClient != null ? this.filterClient.id : null,
      date: this.filterDate != null ? this.filterDate.format('YYYY-MM-DD') : null
    };
  }



  onCleanFilter(): void {
    this.filterClient = null;
    this.filterGame = null;
    this.filterDate = moment();
    this.getLoans({
      pageIndex: 0,
      pageSize: this.pageSize,
      length: this.totalElements()
    });
  }

  onSearch(): void {
    this.getLoans({
      pageIndex: 0,
      pageSize: this.pageSize,
      length: this.totalElements()
    });

  }
  editLoan(loan: Loan) {
    this.openEditCreateModal(
      {
        object: loan,
        id: loan.id,
        editMode: true
      }
    )
  }

  createLoan() {
    const id: number = this.nextId();
    this.openEditCreateModal(
      {
        object: {
          id: id,
          game: null,
          client: null,
          startDate: '',
          endDate: ''
        },
        id: id,
        editMode: false
      }
    )
  }

  private openEditCreateModal(data: editCreateDataModel<Loan>) {

    const dialogRef = this.dialog.open(LoanEditComponent, {
      data: data
    });


    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteLoan(loan: Loan) {

  }


}
