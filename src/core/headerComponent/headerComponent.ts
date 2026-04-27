
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '../../userAuth/auth-modal/auth-modal.component';
import { AuthService } from '../service/auth.service';
import { AuthMode } from '../../userAuth/model/AuthMode';


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
export class HeaderComponent implements OnInit{
  title = 'tutorial Angular';

  isLoggedIn$ = this.authService.isLoggedIn$;
  constructor(
    public dialog: MatDialog,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    //console.log('init header')
    this.authService.isTokenValid().subscribe(
      isValid=>{
        if(!isValid){
          this.logOut()
        }
      }
    )
  }
  openSignInModal() {
    const dialogRef = this.dialog.open(AuthModalComponent, {
      disableClose: true,
      data:{mode:AuthMode.SIGNIN}
    });

  }

  openLogInModal() {
    const dialogRef = this.dialog.open(AuthModalComponent,{
      disableClose:true,
      data:{
        mode:AuthMode.LOGIN
      }
    })
  }

  logOut() {
    this.authService.logOut();
  }

}
