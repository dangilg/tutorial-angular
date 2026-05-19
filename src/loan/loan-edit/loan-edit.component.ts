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
import { Interval } from '../model/available/Interval';
import { interval, range } from 'rxjs';


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
  styleUrl: './loan-edit.component.scss'
})
export class LoanEditComponent implements OnInit {
  loan: Loan;
  editMode: boolean;

  validStartDates:Interval[]=null;
  validEndDates:Interval[]=null;

  games: Game[];
  clients: Client[];

  startDateFilter = (date: Moment | null): boolean => {



    if (!date) return false;

    const day = date.clone().startOf('day');

    if (date.isBefore(moment(), 'day')) return false;

    if(!this.validStartDates || this.validStartDates.length===0){
      return true
    }

    return this.validStartDates.some(interval =>{
      const start = moment(interval.start).startOf('day');
      const end = moment(interval.end).startOf('day');

      return day.isSameOrAfter(start) && day.isSameOrBefore(end);
    })
  }

  endDateFilter = (date: Moment | null): boolean => {

    if (!date) return false;
    const day = date.clone().startOf('day');

    if (!this.startDate) return false;

    if (day.isBefore(moment(), 'day')) return false;

    const min = this.startDate.clone();
    const max = this.startDate.clone().add(13, 'days');

    if(!(day.isSameOrAfter(min,'day') && day.isSameOrBefore(max,'day'))){
      return false;
    }

    if(!this.validEndDates || this.validEndDates.length === 0){
      return true;
    }

    return this.validEndDates.some(interval => {
      const start = moment(interval.start).startOf('day');
      const end = moment(interval.end).startOf('day');

      return day.isSameOrAfter(start) && day.isSameOrBefore(end);
    })
  };


  dateClass = (date: Moment): string => {

    const startDate: Moment = this.form.get('startDate').value;
    const endDate: Moment = this.form.get('endDate').value;
    if (startDate && date.isSame(startDate, 'day')) {
      return 'start-date';
    }
    if (endDate && date.isSame(endDate, 'day')) {
      return 'end-date';
    }
    return '';
  }

  get startDate() {
    return this.form.get('startDate').value
  }

  get endDate() {
    return this.form.get('endDate').value
  }


  form = new FormGroup<{
    id: FormControl<string | null>;
    game: FormControl<Game | null>;
    client: FormControl<Client | null>;
    startDate: FormControl<Moment | null>;
    endDate: FormControl<Moment | null>;
  }>({
    id: new FormControl({ value: '', disabled: true }),
    game: new FormControl(null),
    client: new FormControl(null),
    startDate: new FormControl<Moment | null>(null),
    endDate: new FormControl<Moment | null>(null)
  });


  originalValue:any;

  constructor(
    public dialogRef: MatDialogRef<LoanEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: editCreateDataModel<Loan>,
    private loanService: LoanService,
    private clientservice: ClientService,
    private gameService: GameService
  ) { }

  ngOnInit(): void {


    this.form.valueChanges.subscribe(
      value => {

        this.onFieldChange(value);

      }
    );



    this.loan = this.data.object ? { ...this.data.object } : new Loan();
    this.editMode = this.data.editMode;


    this.form.setValue({
      id: this.data.id.toString(),
      game: this.loan.game ?? null,
      client: this.loan.client ?? null,
      startDate: this.loan.startDate ? moment(this.loan.startDate) : null,
      endDate: this.loan.endDate ? moment(this.loan.endDate) : null

    }, { emitEvent: true });

    this.originalValue = this.normalizeValue(this.form.value);

    this.gameService.getGames().subscribe(
      (games) => {
        this.games = games;

        if (this.loan.game != null) {
          const gameFilter: Game[] = games.filter(
            (game) =>
              game.id == this.loan.game.id
          );
          if (gameFilter != null) {
            this.loan.game = gameFilter[0];
          }
        }
      }
    );

    this.clientservice.getClients().subscribe(
      (clients) => {
        this.clients = clients;

        if (this.loan.client != null) {
          const clientFilter: Client[] = clients.filter(
            (client) =>
              client.id == this.loan.client.id
          );
          if (clientFilter != null) {
            this.loan.client = clientFilter[0];
          }
        }
      }
    )

  }

  normalizeValue(value:any){
    return{
      gameId: value.game?.id ?? null,
      clientId: value.client?.id ?? null,
      startDate: value.startDate?.format('YYYY-MM-DD') ?? null,
      endDate: value.endDate?.format('YYYY-MM-DD') ?? null
    };
  }

  isUnchanged():boolean{
    console.log('nuevo, original');
    console.log(this.form.value);
    console.log(this.originalValue);

    const current = this.normalizeValue(this.form.value);
    return JSON.stringify(current) === JSON.stringify(this.originalValue);
  }

  onSave() {
    const formValue = this.form.value;
    this.loanService.saveLoan({
      loanId: this.data.editMode ?this.data.id : null,
      clientId: formValue.client?.id ?? null,
      gameId: formValue.game?.id ?? null,
      startDate: formValue.startDate?.format('YYYY-MM-DD') ?? null,
      endDate: formValue.endDate?.format('YYYY-MM-DD') ?? null
    }).subscribe();
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

  clean(){
    this.form.patchValue({
      game:null,
      client:null,
      startDate:null,
      endDate:null
    },{
      emitEvent:false
    })

    this.form.updateValueAndValidity({emitEvent:true});
  }
  onFieldChange(formValue: typeof this.form.value) {


    this.validateDates();

    this.loanService.getAvailables({
      loanId: this.data.editMode ?this.data.id : null,
      clientId: formValue.client?.id ?? null,
      gameId: formValue.game?.id ?? null,
      startDate: formValue.startDate?.format('YYYY-MM-DD') ?? null,
      endDate: formValue.endDate?.format('YYYY-MM-DD') ?? null
    }).subscribe(
      (data)=>{

        this.clients = data.clients;
        this.games = data.games;
        this.validStartDates = data.validStartDates;
        this.validEndDates = data.validEndDates;
      }
    )


  }
  validateDates() {
    if (this.startDate && this.endDate) {
      if (this.endDate.isBefore(this.startDate)) {
        this.form.get('endDate').setValue(null);
        return;
      }

      const diff = this.endDate.diff(this.startDate, 'days');

      if (Math.abs(diff) > 13) {
        this.form.get('endDate').setValue(null);
      }
    }
  }

  compareById = (element1:any, element2:any):boolean=>{

    return element1 && element2 ? element1.id === element2.id : element1===element2;
  };





}
