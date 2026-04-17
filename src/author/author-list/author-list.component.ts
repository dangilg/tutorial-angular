import { Component, OnInit, ViewChild, signal } from '@angular/core';
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


@Component({
  selector: 'app-author-list',
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule, MatPaginatorModule],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.scss',
})
export class AuthorListComponent implements OnInit {
  pageNumber: number = 0;
  pageSize: number = 5;

  totalElements=signal(0);

  nextId:number = -1;

  dataSource = new MatTableDataSource<Author>();
  displayedColumns: string[] = ['id', 'name', 'nationality', 'action'];

  isLoggedIn$ = this.authService.isLoggedIn$;



  @ViewChild(MatPaginator) paginator!: MatPaginator;



  constructor(
    private authorService: AuthorService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPage();
  }


  loadPage(event?: PageEvent) {
    console.log("event");
    console.log(event);
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
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
      console.log('tamaño authors list:')
      console.log(this.dataSource.data.length);

      if(this.dataSource.data.length==0&&pageable.pageNumber!=0){
        const evt:PageEvent={
          pageIndex:pageable.pageNumber-1,
          previousPageIndex:pageable.pageNumber,
          pageSize:pageable.pageSize,
          length:data.totalElements
        }
        this.loadPage(evt);
      }
      else{
        this.pageNumber = data.pageable.pageNumber;
        this.pageSize = data.pageable.pageSize;
        this.totalElements.set(data.totalElements);
      }

      if(this.nextId<data.totalElements){
        this.nextId=data.totalElements+1;
        console.log('nextId:'+ this.nextId);
      }

    });
  }

  createAuthor() {
    const id: number = this.nextId;
    this.openEditCreateModal(
      {
        object: {
          id: id,
          name: '',
          nationality: ''
        },
        editMode: false
      }
    )
  }

  editAuthor(author: Author) {
    this.openEditCreateModal(
      {
        object: author,
        editMode: true
      }
    )
  }

  private openEditCreateModal(data: editCreateDataModel<Author>) {
    const dialogRef = this.dialog.open(AuthorEditComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if(result &&!data.editMode){
        this.nextId+=1;

        if(this.dataSource.data.length==this.pageSize){
          this.pageNumber+=1;
        }
      }

      this.ngOnInit();
    });
  }


  deleteAuthor(author: Author) {
    console.log(this.pageNumber);
    this.authorService.isDeleteable(author.id).subscribe(
      result => {
        if (!result.canDelete) {
          const dialogRef = this.dialog.open(NotDeleteableComponent, {
            disableClose: true,
            data: result
          });
        }
        else {
          const dialogRef = this.dialog.open(DialogConfirmationComponent, {
            data: {
              title: 'Eliminar autor',
              description:
                'Atención si borra el autor se perderán sus datos.<br> ¿Desea eliminar el autor?',
            },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.authorService.deleteAuthor(author.id).subscribe(
                {
                  next: () => {
                    this.ngOnInit();
                  }
                  ,
                  error: (err) => {
                    switch (err.status) {
                      case 401: console.error('not valid token');break;
                      case 404: console.error('not found author');break;
                      case 409: console.error('cant delete Author in use');break;
                      default:console.error('Default');
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
