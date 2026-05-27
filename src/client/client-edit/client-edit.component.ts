import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../service/client.service';
import { Client } from '../model/client';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { editCreateDataModel } from '../../core/model/editCreateDataModel';

//Componente de edición y creación de un Cliente
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
  //NgModel que modifica el mensaje de error de client.name
  @ViewChild('nameCtrl') nameCtrl!: NgModel;

  client: Client;
  editMode: boolean;
  errMsg: string = "a";
  id: number;
  originalClient: Client;

  constructor(
    public dialogRef: MatDialogRef<ClientEditComponent>,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: editCreateDataModel<Client>,
  ) { }

  ngOnInit(): void {
    //Copiamos los valores del Cliente dado, o creamos uno nuevo si este es null
    this.client = this.data.object ? { ...this.data.object } : new Client();

    this.originalClient = { ...this.client };

    this.id = this.data.id;
    this.editMode = this.data.editMode;
  }


  //Gestinamos si el Cliente es distinto del Original
  isUnchanged(): boolean {
    return JSON.stringify(this.client) === JSON.stringify(this.originalClient);
  }

  //Gestionamos el guard<do del Cliente en la BD.
  onSave() {
    //Si es modo creación, el id es null
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
