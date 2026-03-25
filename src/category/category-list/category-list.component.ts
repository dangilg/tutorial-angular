import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../models/category';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../service/category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { categoryEditDataModel } from '../models/category-edit-dataModel';


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
export class CategoryListComponent implements OnInit{

    dataSource = new MatTableDataSource<Category>();
    displayedColumns: string[] = ['id', 'name', 'action'];


    constructor(
      private categoryServide: CategoryService,
      public dialog:MatDialog,

    ) {
    }

    ngOnInit(): void {
      this.categoryServide.getCategories().subscribe(
        categories=>this.dataSource.data=categories
      );
    }

    funEdit(category:Category){

      this.openEditCreateModal(
        {category:category
          ,
          editMode:true
        }
      )

    }


    funDelete(id:number){
      this.categoryServide.deleteCategory(id);
    }

    createCategry(){
      const id:number = this.dataSource.data[this.dataSource.data.length-1].id +1;
      this.openEditCreateModal(
        {category:
          {id:id,
            name:''
          },
          editMode:false
        }
      )
    }

    private openEditCreateModal(data:categoryEditDataModel){

      const dialogRef = this.dialog.open(CategoryEditComponent, {
        data:data
      });

       dialogRef.afterClosed().subscribe(result=> {
        this.ngOnInit();
      });
    }
}
