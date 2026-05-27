
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '../../userAuth/auth-modal/auth-modal.component';
import { AuthService } from '../service/auth.service';
import { AuthMode } from '../../userAuth/model/AuthMode';
import { LogOutComponent } from '../../userAuth/logOutModal/logOutComponent';
import { LogOutMode } from '../../userAuth/logOutModal/model/LogOutMode';

//Componente que gestiona la cabecera de la páginca, así como la revisión periódica del token válido.
@Component({
  selector: 'app-header-component',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './headerComponent.html',
  styleUrl: './headerComponent.scss',
})
export class HeaderComponent implements OnInit {
  title = 'tutorial Angular';

  //Variable global que almacena si el usuario ha iniciaso sesión.
  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    //Obtenemos el token y comprobamos si sisgue siendo válido.
    if (this.authService.getToken()) {
      this.authService.isTokenValid().subscribe(
        isValid => {
          //El token no es válido, cerramos sesión.
          if (!isValid) {
            //se puede modificar con un mensaje
            const dialogRef = this.dialog.open(LogOutComponent, {
              data: {
                modo: LogOutMode.AUTO,
                mensaje: 'el token ha expirado'
              }

            })
          }
        }
      )
    }
  }

  //Abrimos el modal de Registrarse.
  openSignInModal() {
    const dialogRef = this.dialog.open(AuthModalComponent, {
      disableClose: true,
      data: { mode: AuthMode.SIGNIN }
    });

  }

  //Abrimos el modal de Iniciar Sesión.
  openLogInModal() {
    const dialogRef = this.dialog.open(AuthModalComponent, {
      disableClose: true,
      data: {
        mode: AuthMode.LOGIN
      }
    })
  }


  //Abrimos el modal de Cierre de Sesión.
  logOut() {
    const dialogRef = this.dialog.open(LogOutComponent, {
      data: {
        modo: LogOutMode.MANUAL,
        mensaje: 'Va a cerrar sesión. ¿Está seguro?'
      }
    })

  }

}
