import { ChangeDetectorRef, Component, Inject, OnInit, signal } from '@angular/core';
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
import { MatDatepickerModule } from "@angular/material/datepicker";
import moment, { Moment } from 'moment';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CommonModule } from '@angular/common';
import { Interval } from '../model/available/Interval';
import { forkJoin } from 'rxjs';

//Componente que gestiona la edición y creación de un Préstamo.
//Utiliza reactive forms, para aplicar filtros dinámicos.
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
  //Lista de Interval, de fechas válidas para el filtro de Fecha Inicial
  validStartDates: Interval[] = null;
  //Lista de Interval, de fechas válidas para el filtro de Fecha Final
  validEndDates: Interval[] = null;

  //Lista de Juegos (filtrados)
  games: Game[];
  //Lista de Clientes (filtrados)
  clients: Client[];

  //Variable que comprueba si la lista ha cargado, para mostrar todo a la vez tras los cambios.
  isLoaded = signal(false);


  //Filtro de Fechas Inicales
  startDateFilter = (date: Moment | null): boolean => {
    //Fecha no válida si es null
    if (!date) return false;

    const day = date.clone().startOf('day');

    //No válida si es anterior a Hoy
    if (date.isBefore(moment(), 'day')) return false;

    //Válida si existe la lista de fechas iniciales válidas o si si su tamaño es 0
    if (!this.validStartDates || this.validStartDates.length === 0) {
      return true
    }

    //Válida si los intervalos de inicio  incumplen la siguiente regla de negocio:
    //+ Las fechas deben estar entre la fecha de inicio y la fecha de fin
    return this.validStartDates.some(interval => {
      const start = moment(interval.start).startOf('day');
      const end = moment(interval.end).startOf('day');

      return day.isSameOrAfter(start) && day.isSameOrBefore(end);
    })
  }


  //Filtro de fechas de fin
  endDateFilter = (date: Moment | null): boolean => {
    if (!date) return false;
    const day = date.clone().startOf('day');

    if (!this.startDate) return false;

    if (day.isBefore(moment(), 'day')) return false;

    const min = this.startDate.clone();
    const max = this.startDate.clone().add(13, 'days');

    if (!(day.isSameOrAfter(min, 'day') && day.isSameOrBefore(max, 'day'))) {
      return false;
    }

    if (!this.validEndDates || this.validEndDates.length === 0) {
      return true;
    }

    return this.validEndDates.some(interval => {
      const start = moment(interval.start).startOf('day');
      const end = moment(interval.end).startOf('day');

      return day.isSameOrAfter(start) && day.isSameOrBefore(end);
    })
  };


  //Función que da formato a la fecha en el DatePicker
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


  //Definicion del Formulario Reactivo
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


  originalValue: any;

  constructor(
    public dialogRef: MatDialogRef<LoanEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: editCreateDataModel<Loan>,
    private loanService: LoanService,
    private clientservice: ClientService,
    private gameService: GameService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {


    //Detecta cualquier cambio en el formulario
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

    //Juntamos las 2 peticiones al back en el mismo hilo por concurrencia
    forkJoin({
      games: this.gameService.getGames(),
      clients: this.clientservice.getClients()
    }).subscribe(({ games, clients }) => {
      //Dados los valores del formulario, se hace una llamada al back para filtrar.
      this.games = games;
      this.clients = clients;

      if (this.loan.game) {
        this.loan.game = games.find(
          g => g.id === this.loan.game.id
        ) ?? null;
        this.form.patchValue({
          game: this.loan.game
        },
          { emitEvent: false });
      }

      if (this.loan.client) {
        this.loan.client = clients.find(
          c => c.id === this.loan.client.id
        ) ?? null;
        this.form.patchValue({
          client: this.loan.client
        },
          { emitEvent: false });
      }

      //Se cambia el estado a Loaded true, para que la vista muestre los datos, sin tener que volver a cambiar su valor después
      //Sirve para eliminar el error NG0100
      this.isLoaded.set(true);
    })


  }

  //Damos formato a los valores del formulario
  normalizeValue(value: any) {
    return {
      gameId: value.game?.id ?? null,
      clientId: value.client?.id ?? null,
      startDate: value.startDate?.format('YYYY-MM-DD') ?? null,
      endDate: value.endDate?.format('YYYY-MM-DD') ?? null
    };
  }


  //Funión que comrueba si los valores del formulario son iguales a lor originales o son null
  //Sirve para activar o desactiva el botón Guardar
  isUnchangedOrNotFull(): boolean {
    const current = this.normalizeValue(this.form.value);
    if(current.clientId == null ||
      current.gameId==null ||
      current.startDate == null ||
      current.endDate == null
    ){
      return true;
    }
    return JSON.stringify(current) === JSON.stringify(this.originalValue);
  }

  //Función para guardar el Prestamo
  onSave() {
    const formValue = this.form.value;
    this.loanService.saveLoan({
      loanId: this.data.editMode ? this.data.id : null,
      clientId: formValue.client?.id ?? null,
      gameId: formValue.game?.id ?? null,
      startDate: formValue.startDate?.format('YYYY-MM-DD') ?? null,
      endDate: formValue.endDate?.format('YYYY-MM-DD') ?? null
    }).subscribe();
    this.dialogRef.close(true);
  }

  onClose() {
    this.dialogRef.close(false);
  }

  //Limpiamos los valores del formulario
  clean() {
    this.form.patchValue({
      game: null,
      client: null,
      startDate: null,
      endDate: null
    }, {
      emitEvent: false
    })

    this.form.updateValueAndValidity({ emitEvent: true });
  }

  //Función para los cambios detectados
  onFieldChange(formValue: typeof this.form.value) {



    //Validamos las fechas del formualrio
    this.validateDates();

    //Obtenemos los datos para Clientes, Juegos y Fechas que cumplan las reglas de negocio desde el back

    this.loanService.getAvailables({
      loanId: this.data.editMode ? this.data.id : null,
      clientId: formValue.client?.id ?? null,
      gameId: formValue.game?.id ?? null,
      startDate: formValue.startDate?.format('YYYY-MM-DD') ?? null,
      endDate: formValue.endDate?.format('YYYY-MM-DD') ?? null
    }).subscribe(
      (data) => {

          this.clients = [...data.clients];
          this.games = [...data.games];
          this.validStartDates = data.validStartDates;
          this.validEndDates = data.validEndDates;

        // Renderizamos le DOM
          this.cdr.detectChanges();
      }
    );


  }

  //Validación de las fechas del formulario
  //Las fechas no pueden ser null
  //Fecha fi  mayor a fecha inicio
  //Máximo 14 días entre fecha inicio y fecha fin
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

  //Comparamos los Juegos y los Cliente por Id en vez de por nombre.
  compareById = (element1: any, element2: any): boolean => {

    return element1 && element2 ? element1.id === element2.id : element1 === element2;
  };





}
