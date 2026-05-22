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
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';

import { forkJoin } from 'rxjs';
import { NotDeleteableComponent } from '../../core/notDeleteableComponent/notDeleteable.component';

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

  filterGameId: number = null;
  filterClientId: number = null;


  filterDate: Moment = moment();

  games: Game[] = [];
  clients: Client[] = [];

  loansList = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'game', 'client', 'startDate', 'endDate', 'action'];

  isLoggedIn$ = this.authService.isLoggedIn$;

  pageNumber: number = 0;
  pageSize: number = 5;

  totalElements: number = 0;

  sort: SortPage = {
    property: 'id',
    direction: 'ASC'
  }



  isLoaded = signal(false);

  nextId: number = -1;

  constructor(
    private authService: AuthService,
    private loanService: LoanService,
    private clientService: ClientService,
    private gameServie: GameService,
    private dialog: MatDialog,

  ) {

  }

  ngOnInit(): void {
    forkJoin({
      clients: this.clientService.getClients(),
      games: this.gameServie.getGames(),

    }).subscribe(
      ({ clients, games}) => {
        this.clients = clients;
        this.games = games;


        this.getLoans();
        //console.log(this.isLoaded());
        this.isLoaded.set(true);
        //console.log(this.isLoaded());
      }
    );

  }

  getLoans(event?: PageEvent) {
    const pageable: Pageable = this.getPageable(event);
    const filters: FilterDataModel = this.getFilters();

    this.loanService.getLoans({
      pageable: pageable,
      filters: filters
    }).subscribe(
      (data) => {

        this.loansList.data = data.content;

        //para evitar el error de renderizado q ocurre cuando data.content está vacío
        if(this.loansList.data.length==0){
          this.isLoaded.set(false);
        }

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
          this.pageNumber = data.pageable.pageNumber;
          this.pageSize = data.pageable.pageSize;
          this.totalElements = data.totalElements;
        }

        this.isLoaded.set(true);
      }
    );

  }

  getPageable(event?: PageEvent): Pageable {
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
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
      gameId: this.filterGameId != null ? this.filterGameId : null,
      clientId: this.filterClientId != null ? this.filterClientId : null,
      date: this.filterDate != null ? this.filterDate.format('YYYY-MM-DD') : null
    };
  }



  onCleanFilter(): void {
    this.filterClientId = null;
    this.filterGameId = null;
    this.filterDate = moment();
    this.getLoans({
      pageIndex: 0,
      pageSize: this.pageSize,
      length: this.totalElements
    });
  }

  onSearch(): void {
    this.getLoans({
      pageIndex: 0,
      pageSize: this.pageSize,
      length: this.totalElements
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
    this.loanService.getLastId().subscribe(
      result=>{
        const id = result+1;

        if(id>this.nextId){
          this.nextId = id;
        }
        else{
          this.nextId+=1;
        }


        this.openEditCreateModal(
      {
        object: {
          id: this.nextId,
          game: null,
          client: null,
          startDate: '',
          endDate: ''
        },
        id: this.nextId,
        editMode: false
      }
    )
      }
    )


  }

  private openEditCreateModal(data: editCreateDataModel<Loan>) {

    const dialogRef = this.dialog.open(LoanEditComponent, {
      data: data
    });


    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);
      if(!result){
        this.nextId-=1;
      }
      if(result &&!data.editMode){

        if(this.loansList.data.length==this.pageSize){
          console.log(this.pageNumber);
          this.pageNumber+=1;
          console.log(this.pageNumber);
        }
      }

      this.ngOnInit();
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   this.ngOnInit();
    // });
  }

  deleteLoan(loan: Loan) {
    const endDate = moment(loan.endDate);
    const startDate = moment(loan.startDate);

    if (moment().isBetween(startDate, endDate, 'day') ||moment().isSame(startDate,'day') || moment().isSame(endDate,'day')) {
      const dialogRef = this.dialog.open(NotDeleteableComponent, {
        data: {
          canDelete: false,
          reason: 'EN PROCESO'
        }
      })
    }
    else {
      const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: { title: "Eliminar Prestamo", description: "Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo?" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loanService.delete(loan.id).subscribe(
            {
              next: () => {
                this.ngOnInit();
              },
              error: (err) => {
                switch (err.status) {
                  case 401: console.error('not valid token'); break;
                  case 404: console.error('not found category'); break;
                  case 409: console.error('Cant delete Category in use'); break;
                  default: console.error('Default');
                }
              }
            }
          );
        }
      });
    }
  }


  isNotEditable(loan: Loan) {
    const endDate = moment(loan.endDate);
    if (endDate.isBefore(moment(), 'day')) {
      return true
    }
    return false;
  }
}
