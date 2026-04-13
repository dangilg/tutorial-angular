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
  gameId:number;


  constructor(
    public dialogRef: MatDialogRef<GameEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gameService: GameService,
    private categoryService: CategoryService,
    private authorService: AuthorService
  ) { }

  ngOnInit(): void {

    if (this.data.game) {
      this.game = this.data.game;
      this.gameId=this.game.id;
    }
    else {
      this.game = new Game();
      this.gameId = this.data.newId;
    }

    //this.game = this.data.game ? Object.assign({}, this.data.game) : new Game();
    console.log("game-edit.component // ngOnInit // game");
    console.log(this.game);
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;

      if (this.game.category != null) {
        const categoryFilter: Category[] = categories.filter(
          (category) => category.id == this.data.game.category.id
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
          (author) => author.id == this.data.game.author.id
        );
        if (authorFilter != null) {
          this.game.author = authorFilter[0];
        }
      }
    });
  }

  onSave() {
    console.log(this.game);
    this.gameService.saveGame(this.game).subscribe((result) => {
      this.dialogRef.close();
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
