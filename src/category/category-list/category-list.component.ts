import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../model/category';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../service/category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { editCreateDataModel } from '../../core/model/editCreateDataModel';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';
import { AuthService } from '../../core/service/auth.service';
import { NotDeleteableComponent } from '../../core/notDeleteableComponent/notDeleteable.component';

@Component({
  selector: 'app-category-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {

  dataSource = new MatTableDataSource<Category>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private authService: AuthService,

  ) {
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(
      categories => this.dataSource.data = categories
    );
  }

  funEdit(category: Category) {

    this.openEditCreateModal(
      {
        object: category
        ,
        editMode: true
      }
    )

  }


  funDelete(category: Category) {
    this.categoryService.isDeleteable(category.id).subscribe(
      result => {
        if (!result.canDelete) {
          const dialogRef = this.dialog.open(NotDeleteableComponent, {disableClose:true, data: result });
        }
        else {
          const dialogRef = this.dialog.open(DialogConfirmationComponent, {
            data: { title: "Eliminar categoría", description: "Atención si borra la categoría se perderán sus datos.<br> ¿Desea eliminar la categoría?" }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.categoryService.deleteCategory(category.id).subscribe(
                {
                  next: () => {
                    this.ngOnInit();
                  },
                  error: (err) => {
                    console.log(err)
                  }
                }
              );
            }
          });
        }
      }
    )

  }

  createCategry() {
    const id: number = this.dataSource.data[this.dataSource.data.length - 1].id + 1;
    this.openEditCreateModal(
      {
        object:
        {
          id: id,
          name: ''
        },
        editMode: false
      }
    )
  }

  private openEditCreateModal(data: editCreateDataModel<Category>) {

    const dialogRef = this.dialog.open(CategoryEditComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}
