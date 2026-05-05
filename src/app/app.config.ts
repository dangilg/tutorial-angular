import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch,withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { jwtInterceptor } from '../core/service/jwtInterceptor.service';
//estos imports para poner el DatePicker en español y con formato dd/mm/yyyy

import { provideMomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE,MAT_DATE_FORMATS } from '@angular/material/core';
import { ES_DATE_FORMATS } from '../core/model/matDate/date-formats';

import 'moment/locale/es';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    //esto para poner el DatePicker en español y con formato dd/mm/yyyy
    {provide:MAT_DATE_LOCALE,useValue: 'es-Es'},
    {provide:MAT_DATE_FORMATS,useValue: ES_DATE_FORMATS},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue:{strict:true}},
    provideMomentDateAdapter()
  ]
};
