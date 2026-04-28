import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../service/client.service';
import { Client } from '../model/client';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { editCreateDataModel } from '../../core/model/editCreateDataModel';

@Component({
  selector: 'app-category-edit',

  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent implements OnInit {
  @ViewChild('nameCtrl') nameCtrl!: NgModel;

  client: Client;
  editMode: boolean;
  errMsg: string = "a";
  id:number;
  constructor(
    public dialogRef: MatDialogRef<ClientEditComponent>,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: editCreateDataModel<Client>,
  ) { }

  ngOnInit(): void {
    //si existe this.data.category -> crear nuevo objeto con los datos del mismo
    //sino, nuevo objeto vacío.
    this.client = this.data.object ? { ...this.data.object } : new Client();
    this.id = this.data.id;
    this.editMode = this.data.editMode;
    // this.nameCtrl.control.setErrors({ alreadyExists: false });
  }

  onSave() {
    if (!this.editMode) {
      this.client.id = null;
    }

    this.clientService.saveClient(this.client).subscribe(
      {
        next: () => {
          this.dialogRef.close();
        },
        error: (err) => {
          switch (err.status) {
            case 401: console.error('Not Valid Token'); break;
            case 404: console.error('Not Found Client'); break;
            case 409: console.error('Client Already Exists'); this.nameCtrl.control.setErrors({ alreadyExists: true }); break;
            default: console.error('Default');
          }
        }



      });

  }

  onClose() {
    this.dialogRef.close();
  }
}
