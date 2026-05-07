import { Component, Inject, OnInit } from '@angular/core';
import { Loan } from '../model/Loan';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/client';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { editCreateDataModel } from '../../core/model/editCreateDataModel';
import { LoanService } from '../service/loan.service';
import { ClientService } from '../../client/service/client.service';
import { GameService } from '../../game/service/game.service';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle } from "@angular/material/datepicker";
import moment, { Moment } from 'moment';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-loan-edit',
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    CommonModule
],
  templateUrl: './loan-edit.component.html',
  styleUrl:'./loan-edit.component.scss'
})
export class LoanEditComponent implements OnInit{
  loan:Loan;
  editMode: boolean;
  id:number;

  games:Game[];
  clients:Client[];

  startDate:Moment|null = null;



  endDate:Moment|null = null;
  endDateFilter = (date:Moment|null):boolean=>{
    if(!date) return false;
    if(!this.startDate) return true;

    const min = this.startDate.clone();
    const max = this.startDate.clone().add(13,'days');

    return date.isSameOrAfter(min,'day') && date.isSameOrBefore(max,'day');
  };


  dateClass = (date:Moment):string=>{
    console.log(date.format('DD/MM/YYYY'));
    if(this.startDate && date.isSame(this.startDate,'day')){
      return 'start-date';
    }
    if(this.endDate && date.isSame(this.endDate,'day')){
      return 'end-date';
    }
    return '';
  }


  gameSelected = new FormControl();
  clientSelected = new FormControl();
  startDateSelected = new FormControl();
  endDateSelected = new FormControl();
  form = new FormGroup({
    gameSelected:this.gameSelected,
    clientSelected:this.clientSelected,
    startDateSelected:this.startDateSelected,
    endDateSelected:this.endDateSelected
  });

  constructor(
    public dialogRef:MatDialogRef<LoanEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: editCreateDataModel<Loan>,
    private loanService:LoanService,
    private clientservice:ClientService,
    private gameService:GameService
  ){}

  ngOnInit():void{

    Object.keys(this.form.controls).forEach(
      key=>{
        this.form.get(key)?.valueChanges.subscribe(
          value=>{
            console.log(key);
            console.log(value);
          }
        );
      }
    );

    this.loan = this.data.object?{...this.data.object}: new Loan();
    this.editMode = this.data.editMode;
    this.id = this.data.id;

    this.startDate = moment(this.loan.start_date);
    this.endDate = moment(this.loan.end_date);

    this.gameService.getGames().subscribe(
      (games)=>{
        this.games=games;

        if(this.loan.game!=null){
          const gameFilter:Game[] = games.filter(
            (game)=>
              game.id == this.loan.game.id
          );
          if(gameFilter!=null){
            this.loan.game = gameFilter[0];
          }
        }
      }
    );

    this.clientservice.getClients().subscribe(
      (clients)=>{
        this.clients = clients;

        if(this.loan.client != null){
          const clientFilter:Client[] = clients.filter(
            (client)=>
              client.id == this.loan.client.id
          );
          if(clientFilter!=null){
            this.loan.client = clientFilter[0];
          }
        }
      }
    )

  }

  onSave(){

  }

  onClose(){

  }


  onStartChange(){
    if(this.startDate && this.endDate){
      if(this.endDate.isBefore(this.startDate)){
        this.endDate = null;
      }
      const diff = this.endDate.diff(this.startDate,'days');

      if(Math.abs(diff)>13){
        this.endDate=null;
      }
    }
  }

  onEndChange(){
    if(this.startDate && this.endDate){
      const diff = this.endDate.diff(this.startDate,'days');

      if(Math.abs(diff)>13){
        this.endDate=null;
      }
    }
  }


 }
