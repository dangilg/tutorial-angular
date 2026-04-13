import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../service/category.service';
import { Category } from '../model/category';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    templateUrl: './category-edit.component.html',
    styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent implements OnInit {
    category: Category;
    editMode: boolean;
    constructor(
        public dialogRef: MatDialogRef<CategoryEditComponent>,
        private categoryService: CategoryService,
        @Inject(MAT_DIALOG_DATA) public data:editCreateDataModel<Category>,
    ) {}

    ngOnInit(): void {
      //si existe this.data.category -> crear nuevo objeto con los datos del mismo
      //sino, nuevo objeto vacío.
        this.category = this.data.object ? {...this.data.object}:new Category();

        this.editMode =this.data.editMode;

    }

    onSave() {
        if(!this.editMode){
          this.category.id=null;
        }
        console.log(this.category);
        this.categoryService.saveCategory(this.category).subscribe(() => {
            this.dialogRef.close();
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}
