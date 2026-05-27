import { MatDateFormats } from "@angular/material/core";


//Formato de fechas válidas para los DatePicker
export const ES_DATE_FORMATS: MatDateFormats = {
  parse:{
    dateInput: 'DD/MM/YYYY',
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel:'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
