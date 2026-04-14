import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameService } from '../service/game.service';
import { Game } from '../model/Game';
import { AuthorService } from '../../author/service//author.service';
import { Author } from '../../author/model/Author';
import { CategoryService } from '../../category/service/category.service';
import { Category } from '../../category/model/category';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { editCreateDataModel } from '../../core/model/editCreateDataModel';


@Component({
  selector: 'app-game-edit',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './game-edit.component.html',
  styleUrl: './game-edit.component.scss',
})
export class GameEditComponent implements OnInit {
  game: Game;
  authors: Author[];
  categories: Category[];


  editMode: boolean;


  constructor(
    public dialogRef: MatDialogRef<GameEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: editCreateDataModel<Game>,
    private gameService: GameService,
    private categoryService: CategoryService,
    private authorService: AuthorService
  ) { }

  ngOnInit(): void {
    this.game = this.data.object ? { ...this.data.object } : new Game();
    this.editMode = this.data.editMode;
    //this.game = this.data.game ? Object.assign({}, this.data.game) : new Game();

    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;

      if (this.game.category != null) {
        const categoryFilter: Category[] = categories.filter(
          (category) => category.id == this.game.category.id
        );
        if (categoryFilter != null) {
          this.game.category = categoryFilter[0];
        }
      }
    });

    this.authorService.getAllAuthors().subscribe((authors) => {
      this.authors = authors;

      if (this.game.author != null) {
        const authorFilter: Author[] = authors.filter(
          (author) => author.id == this.game.author.id
        );
        if (authorFilter != null) {
          this.game.author = authorFilter[0];
        }
      }
    });
  }

  onSave() {
    if (!this.editMode) {
      this.game.id = null;
    }
    this.gameService.saveGame(this.game).subscribe(
      {
        next:()=>{
          this.dialogRef.close();
        }
        ,
        error:(err)=>{
          switch(err.status){
            case 401:console.error('Not Valid Token');break;
            case 404:console.error('Not found Game');break;
            default:console.error('Default');
          }
        }

      });
  }

  onClose() {
    this.dialogRef.close();
  }
}
