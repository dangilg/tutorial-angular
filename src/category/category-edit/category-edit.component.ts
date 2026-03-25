import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../service/category.service';
import { Category } from '../models/category';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-category-edit',

    imports: [
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule ],
    templateUrl: './category-edit.component.html',
    styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent implements OnInit {
    category: Category =new Category();
    editMode: boolean=false;
    constructor(
        public dialogRef: MatDialogRef<CategoryEditComponent>,
        private categoryService: CategoryService,
        @Inject(MAT_DIALOG_DATA) public data:any,
    ) {}

    ngOnInit(): void {
        //la inicializacion debemos hacerla antes por strict:true
        //this.category = new Category();
        this.category.id=this.data.id;
        this.category.name =this.data.name;
        this.editMode =this.data.edit;
        console.log(this.editMode);
    }

    onSave() {
        this.categoryService.saveCategory(this.category).subscribe(() => {
            this.dialogRef.close();
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}
