import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorService } from '../service/author.service';
import { Author } from '../model/Author';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { editCreateDataModel } from '../../core/model/editCreateDataModel';

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
    editMode:boolean;
    id:number;
    constructor(
        public dialogRef: MatDialogRef<AuthorEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: editCreateDataModel<Author>,
        private authorService: AuthorService
    ) {}

    ngOnInit(): void {
        this.author = this.data.object ? Object.assign({}, this.data.object) : new Author();
        this.id = this.data.id;
        this.editMode = this.data.editMode;
    }

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
