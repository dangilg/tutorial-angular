import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/service/auth.service';
import { Client } from '../model/client';
import { ClientService } from '../service/client.service';
import { editCreateDataModel } from '../../core/model/editCreateDataModel';
import { ClientEditComponent } from '../client-edit/client-edit.component';
import { NotDeleteableComponent } from '../../core/notDeleteableComponent/notDeleteable.component';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-client-list.component',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,],
  templateUrl: './client-list.component.html',
  styleUrl:'./client-list.component.scss'
})
export class ClientListComponent implements OnInit {

  dataSource = new MatTableDataSource<Client>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  isLoggedIn$ = this.authService.isLoggedIn$;
  nextId;

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private dialog:MatDialog
  ) {

  }

  ngOnInit(): void {
    this.clientService.getClients().subscribe(
      clients => {
        this.dataSource.data = clients;
        const size = clients.length;

        if (this.clientService.getNextId()) {
          if (size != 0) {
            const lastId = this.dataSource.data[size - 1].id;
            if (lastId >= this.clientService.getNextId()) {
              this.clientService.setNextId(lastId + 1);
            }
          }
        }
        else {
          if (size != 0) {
            this.clientService.setNextId(this.dataSource.data[size - 1].id + 1);
          }
          else {
            this.clientService.setNextId(1);
          }
        }
        this.nextId = this.clientService.getNextId();
      }
    )
  }

  private openEditCreateModal(data: editCreateDataModel<Client>) {
    const dialogRef = this.dialog.open(ClientEditComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  edit(client: Client) {
    this.openEditCreateModal(
      {
        object: client
        ,
        id:client.id,
        editMode: true
      }
    )
  }

  createClient() {
    const id: number = this.nextId;
    this.openEditCreateModal(
      {
        object:
        {
          id: id,
          name: ''
        },
        id:id,
        editMode: false
      }
    )
  }
  delete(client:Client){
    this.clientService.isDeleteable(client.id).subscribe(
          result => {
            if (!result.canDelete) {
              const dialogRef = this.dialog.open(NotDeleteableComponent, { disableClose: true, data: result });
            }
            else {
              const dialogRef = this.dialog.open(DialogConfirmationComponent, {
                data: { title: "Eliminar cliente", description: "Atención si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?" }
              });

              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.clientService.deleteClient(client.id).subscribe(
                    {
                      next: () => {
                        this.ngOnInit();
                      },
                      error: (err) => {
                        switch (err.status) {
                          case 401: console.error('not valid token'); break;
                          case 404: console.error('not found category'); break;
                          case 409: console.error('Cant delete Category in use'); break;
                          default: console.error('Default');
                        }
                      }
                    }
                  );
                }
              });
            }
          }
        )
  }
}
