//Clase que define la estructura del DTO de disponibilidad respecto del backend

export class AvailableDto{
  loanId: number | null;
  clientId:number | null;
  gameId:number | null;
  startDate: string | null;
  endDate:string | null;
}
