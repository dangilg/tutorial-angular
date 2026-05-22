
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

  isLoggedIn$ = this.authService.isLoggedIn$;
  constructor(
    public dialog: MatDialog,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    //console.log('init header')

    if (this.authService.getToken()) {
      this.authService.isTokenValid().subscribe(
        isValid => {
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
  openSignInModal() {
    const dialogRef = this.dialog.open(AuthModalComponent, {
      disableClose: true,
      data: { mode: AuthMode.SIGNIN }
    });

  }

  openLogInModal() {
    const dialogRef = this.dialog.open(AuthModalComponent, {
      disableClose: true,
      data: {
        mode: AuthMode.LOGIN
      }
    })
  }

  logOut() {
    const dialogRef = this.dialog.open(LogOutComponent, {
      data: {
        modo: LogOutMode.MANUAL,
        mensaje: 'Va a cerrar sesión. ¿Está seguro?'
      }
    })

  }

}
