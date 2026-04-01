
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { SignInModalComponent } from '../../user/signIn-modal/signIn-modal.component';


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
export class HeaderComponent {
  title = 'tutorial Angular';
  constructor(
    public dialog:MatDialog
  ){

  }

  openSignInModal(){
    const dialogRef = this.dialog.open(SignInModalComponent);
  }

  openLogInModal(){

  }

  openLogOutDialog(){

  }
  logged():boolean{
    return false;
  }
}
