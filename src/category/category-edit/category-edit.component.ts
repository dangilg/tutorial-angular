import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../service/category.service';
import { Category } from '../models/category';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { categoryEditDataModel } from '../models/category-edit-dataModel';

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
    category: Category;
    editMode: boolean;
    constructor(
        public dialogRef: MatDialogRef<CategoryEditComponent>,
        private categoryService: CategoryService,
        @Inject(MAT_DIALOG_DATA) public data:categoryEditDataModel,
    ) {}

    ngOnInit(): void {
        this.category = this.data.category;
        console.log(this.category)
        this.editMode =this.data.editMode;
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
