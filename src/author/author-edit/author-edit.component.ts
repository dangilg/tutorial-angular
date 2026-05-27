import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorService } from '../service/author.service';
import { Author } from '../model/Author';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { editCreateDataModel } from '../../core/model/editCreateDataModel';

//Componente de edición y creación de un autor

@Component({
    selector: 'app-author-edit',
    standalone: true,
    imports: [FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule ],
    templateUrl: './author-edit.component.html',
    styleUrl: './author-edit.component.scss',
})
export class AuthorEditComponent implements OnInit {
    author: Author;

    //Boolean para distinguir si es modo edición o modo creación.
    editMode:boolean;
    id:number;

    //Autor original para comparar si hubo cambios respecto al original.
    originalAuthor: Author;

    constructor(
        public dialogRef: MatDialogRef<AuthorEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: editCreateDataModel<Author>,
        private authorService: AuthorService
    ) {}

    //Construimos el autor según los datos pasados (modo edición) o creamos uno vacío (modo creación)
    ngOnInit(): void {
        this.author = this.data.object ? Object.assign({}, this.data.object) : new Author();
        this.originalAuthor = Object.assign({},this.author);

        this.id = this.data.id;
        this.editMode = this.data.editMode;
    }

    //Comprueba si los datos del autor han variado respecto del original
    isUnchanged():boolean{
      return JSON.stringify(this.author)=== JSON.stringify(this.originalAuthor);
    }


    //En caso de ser creación, el id pasado al Back será null
    //Manejamos la creación correcta del autor o los posibles errores del back.
    onSave() {
      if(!this.editMode){
        this.author.id=null;
      }
        this.authorService.saveAuthor(this.author).subscribe(
          {
            next:()=>{
              this.dialogRef.close(true);
            },
            error:(err)=>{
              switch(err.status){
                case 401:console.error('Not Valid Token');break;
                case 404:console.error('Not Found Author');break;
                default:console.error('Default');
              }
            }
          }
        );
    }

    onClose() {
        this.dialogRef.close(false);
    }
}
