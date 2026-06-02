import { Component, OnInit, ViewChild, effect, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuthorEditComponent } from '../author-edit/author-edit.component';
import { AuthorService } from '../service/author.service';
import { Author } from '../model/Author';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/service/auth.service';
import { editCreateDataModel } from '../../core/model/editCreateDataModel';
import { NotDeleteableComponent } from '../../core/notDeleteableComponent/notDeleteable.component';

//Componente de la página de Autor, con la lista y los botones de creación, edición y borrado.
@Component({
  selector: 'app-author-list',
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule, MatPaginatorModule],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.scss',
})
export class AuthorListComponent implements OnInit {
  NEXTID = 'author_Next_Id';
  pageNumber = signal(0);
  pageSize: number = 5;

  totalElements = signal(0);

  nextId = signal<number>(Number(sessionStorage.getItem(this.NEXTID)) || -1);

  dataSource = new MatTableDataSource<Author>();
  displayedColumns: string[] = ['id', 'name', 'nationality', 'action'];

  isLoggedIn$ = this.authService.isLoggedIn$;



  @ViewChild(MatPaginator) paginator!: MatPaginator;



  constructor(
    private authorService: AuthorService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    effect(() => {
      sessionStorage.setItem(this.NEXTID, this.nextId().toString());
    }
    );
  }

  ngOnInit(): void {
    this.loadPage();
  }


  //Dado el evento, se pide al backend la Page de Author, ya que la lista es paginada
  loadPage(event?: PageEvent) {

    //Creamos el objeto Pageable que define los valores de la Page.
    const pageable: Pageable = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };


    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }



    this.authorService.getAuthors(pageable).subscribe((data) => {
      this.dataSource.data = data.content;

      //Si el tamaño es 0 y no es la primera página, vamos a la anterior.
      if (this.dataSource.data.length == 0 && pageable.pageNumber != 0) {
        const evt: PageEvent = {
          pageIndex: pageable.pageNumber - 1,
          previousPageIndex: pageable.pageNumber,
          pageSize: pageable.pageSize,
          length: data.totalElements
        }
        this.loadPage(evt);
      }
      else {
        this.pageNumber.set(data.pageable.pageNumber);
        this.pageSize = data.pageable.pageSize;
        this.totalElements.set(data.totalElements);
      }

      if (this.nextId() < data.totalElements) {
        this.nextId.set(data.totalElements + 1);
      }
    });
  }

  createAuthor() {
    const id: number = this.nextId();
    this.openEditCreateModal(
      {
        object: {
          id: id,
          name: '',
          nationality: ''
        },
        id: id,
        editMode: false
      }
    )
  }

  editAuthor(author: Author) {
    this.openEditCreateModal(
      {
        object: author,
        id: author.id,
        editMode: true
      }
    )
  }

  //Gestionamos las acciones del modal.
  private openEditCreateModal(data: editCreateDataModel<Author>) {
    const dialogRef = this.dialog.open(AuthorEditComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {

      //Actualizamos el nextId para UX
      if (result && !data.editMode) {
        this.nextId.update(valor => valor + 1);

        //si ha sido una creación correcta, y el tamaño de la Page ya era el máximo, vamos a la siguiente Page
        if (this.dataSource.data.length == this.pageSize) {
          this.pageNumber.update(valor => valor + 1);
        }
      }

      this.ngOnInit();
    });
  }


  // Gestionamos la eliminación correcta o incorrrecta de un Autor
  deleteAuthor(author: Author) {
    // Revisamos si el Autor no está siendo usado en ningún Juego.
    this.authorService.isDeleteable(author.id).subscribe(
      {
        next: (result) => {
          //No se puede eliminar
          if (!result.canDelete) {
            const dialogRef = this.dialog.open(NotDeleteableComponent, {
              disableClose: true,
              data: result
            });
          }

          //Se puede eliminar.
          else {
            const dialogRef = this.dialog.open(DialogConfirmationComponent, {
              data: {
                title: 'Eliminar autor',
                description:
                  'Atención si borra el autor se perderán sus datos.<br> ¿Desea eliminar el autor?',
              },
            });

            //revisamos si tras mostrar mensaje de borrado, se ha confirmado o no.
            dialogRef.afterClosed().subscribe((result: boolean) => {
              //Se confirma borrado, gestionamos el borrado con el backend.
              if (result) {
                this.authorService.deleteAuthor(author.id).subscribe(
                  {
                    next: () => {
                      this.ngOnInit();
                    }
                    ,
                    error: (err) => {
                      switch (err.status) {
                        case 401: console.error('not valid token'); break;
                        case 404: console.error('not found author'); break;
                        case 409: console.error('cant delete Author in use'); break;
                        default: console.error('Default');
                      }
                    }
                  }
                );
              }
            });
          }
        }
        ,
        error: (err) => {
          switch (err.status) {
            case 404: console.error('not found author'); break;
            default: console.error('Default');
          }
        }
      }
    )




  }
}
