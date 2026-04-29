import { Component, OnInit, signal } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
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

@Component({
  selector: 'app-loan-list',

  imports: [
    MatFormField,
    MatLabel,
    MatSelectModule,
    MatOption,
    MatSuffix,
    MatDatepickerModule,
    MatNativeDateModule,
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

  filterGame: Game;
  filterClient: Client;
  filterDate: Date;

  games: Game[];
  clients: Client[];

  loansList = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'game', 'client','startDate','endDate', 'action'];

  isLoggedIn$ = this.authService.isLoggedIn$;

pageNumber=signal(0);
  pageSize: number = 5;

  totalElements=signal(0);

  nextId=signal<number>(Number(sessionStorage.getItem('loanNextId')||-1));

  constructor(
    private authService: AuthService,
    private loanService: LoanService,
    private clientService:ClientService,
    private gameServie: GameService
  ) {

  }
  //todo esto es solo para la demo
  ngOnInit(): void {
    const data = this.loanService.getAuthors();
    this.loansList.data= data.content;
    this.pageNumber.set(data.pageable.pageNumber);
    this.pageSize = data.pageable.pageSize;
    this.totalElements.set(data.totalElements);

    //todo esto si q se debría quedar [inicialmente esta bn]
    this.clientService.getClients().subscribe(
      clients => {
        this.clients = clients;
      }

    )

    this.gameServie.getGames().subscribe(
      games=>{
        this.games = games;
      }
    )
  }

  loadPage(event:PageEvent){

  }
  onCleanFilter() {

  }
  onSearch() {

  }
  editLoan(loan:Loan){

  }
  deleteLoan(loan:Loan){

  }
  createLoan(){

  }
}
