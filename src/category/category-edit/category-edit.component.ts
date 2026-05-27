import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../service/category.service';
import { Category } from '../model/category';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { editCreateDataModel } from '../../core/model/editCreateDataModel';


//Componente que gestiona el Modal de edición y creación de una Categoría
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
    id:number;

    originalCategory: Category;

    constructor(
        public dialogRef: MatDialogRef<CategoryEditComponent>,
        private categoryService: CategoryService,
        @Inject(MAT_DIALOG_DATA) public data:editCreateDataModel<Category>,
    ) {}

    // Copiamos el objeto Categoría dado, o creamos uno nuevo.
    ngOnInit(): void {
        this.category = this.data.object ? {...this.data.object}:new Category();
        this.originalCategory = {...this.category};

        this.id = this.data.id;
        this.editMode =this.data.editMode;

    }

    // Revisamos si los datos de la Categoria han cambiado respecto al original
    isUnchanged():boolean{
      return JSON.stringify(this.category) === JSON.stringify(this.originalCategory);
    }


    //Gestionamos el guardado de la Categoría.
    onSave() {
      //Si es modo creación, el id es null
        if(!this.editMode){
          this.category.id=null;
        }

        this.categoryService.saveCategory(this.category).subscribe(
          {next:()=> {
            this.dialogRef.close();
          },
          error:(err)=>{
            switch(err.status){
              case 401:console.error('Not Valid Token');break;
              case 404:console.error('Not Found Category');break;
              default:console.error('Default');
            }
          }



        });
    }

    onClose() {
        this.dialogRef.close();
    }
}
