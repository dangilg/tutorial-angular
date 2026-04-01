import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { User } from '../model/User';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInService } from '../service/signIn.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-sign-in-modal',
  imports: [MatFormField, MatLabel, MatInput],
  templateUrl: './signIn-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInModalComponent {
  user:User;

  constructor(
        public dialogRef: MatDialogRef<SignInModalComponent>,
        private signInService: SignInService,

    ) {}
 }
