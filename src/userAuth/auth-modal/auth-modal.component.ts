import { Component, Inject, OnInit } from '@angular/core';
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import { User } from '../model/User';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModalService} from '../service/auth-modal.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../core/service/auth.service'
import { AuthMode } from '../model/AuthMode';



@Component({
  selector: 'app-sign-in-modal',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
})
export class AuthModalComponent implements OnInit {
  user: User;
  hidePassword: boolean = true;

  errorVisibility: boolean = false;
  errorMessage: String = "";

  isLoggedIn$ = this.authService.isLoggedIn$;
  AuthMode = AuthMode;
  mode: AuthMode;
  constructor(
    public dialogRef: MatDialogRef<AuthModalComponent>,
    private authModalService: AuthModalService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) private data: { mode: AuthMode }
  ) {
    this.mode = data.mode;
  }

  ngOnInit(): void {

    this.user = new User();
  }

  onClose() {
    this.dialogRef.close();
  }

  signIn() {

    this.authModalService.sigIn(this.user).subscribe(
      {
        next: (response) => {
          this.errorVisibility = false;

          //el usuario se ha registrado correctamente,
          //guardamos el token en SessionStorage para completar el logIn automático tras el register
          this.authService.login(response.token);
          this.dialogRef.close();
        },
        error: (err) => {
          if (err.status === 409) {
            this.errorMessage = "User Already Exists";
            this.errorVisibility = true;
            this.cdr.detectChanges();
          }
        }
      }
    );
  }

  logIn(){
    this.authModalService.logIn(this.user).subscribe(
      {
        next:(response)=>{

            this.errorVisibility=false;

            this.authService.login(response.token);
            this.dialogRef.close();
        },
        error:(err)=>{

          if(err.status===401){
            this.errorMessage = "Wrong User or Password";
            this.errorVisibility = true;
            this.cdr.detectChanges();
          }
        }
      }
    )
  }
}
