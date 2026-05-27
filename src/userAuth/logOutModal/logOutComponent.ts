import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../../core/service/auth.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LogOutDataModel } from "./model/logOutDataModel";
import { LogOutMode } from "./model/LogOutMode";

//Componente que gestiona el cierre de sesión de un Usuario
//Puede ser automático (token no válido) o manual
@Component({
  selector: 'app-log-out-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './logOutComponent.html',
  styleUrl: './logOutComponent.scss',
})
export class LogOutComponent implements OnInit {

  modo:LogOutMode = null;
  mensaje: string = '';
  logOutMode=LogOutMode;
  constructor(
    public dialogRef: MatDialogRef<LogOutComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: LogOutDataModel,
  ) { }

  ngOnInit(): void {

    this.modo = this.data?.modo ?? null;

    this.mensaje = this.data?.mensaje ?? '';

    if(!this.modo){
      console.error('No se puede llamar a logOut sin los datos')
      this.close(false);
    }
  }

  close(valor: boolean) {
    if (valor) {
      this.authService.logOut();

    }
    this.dialogRef.close();
  }
}
