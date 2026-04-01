import { Component, OnInit} from '@angular/core';
import { MatFormField, MatLabel} from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import { User } from '../model/User';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInService } from '../service/signIn.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-sign-in-modal',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
],
  templateUrl: './signIn-modal.component.html',
  styleUrl:'./signIn-modal.component.scss',
})
export class SignInModalComponent implements OnInit{
  user:User;
  hidePassword:boolean =true;

  constructor(
        public dialogRef: MatDialogRef<SignInModalComponent>,
        private signInService: SignInService,

    ) {}

   ngOnInit():void{

    this.user = new User();
   }

   onClose() {
        this.dialogRef.close();
    }

    signIn(){
      this.signInService.sigIn(this.user);
    }
 }
