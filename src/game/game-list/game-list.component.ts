import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameEditComponent } from '../game-edit/game-edit.component';
import { GameService } from '../service/game.service';
import { Game } from '../model/Game';
import { CategoryService } from '../../category/service/category.service';
import { Category } from '../../category/model/category';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GameItemComponent } from './game-item/game-item.component';
import { AuthService } from '../../core/service/auth.service';
import { editCreateDataModel } from '../../core/model/editCreateDataModel';


@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    GameItemComponent
  ],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss',
})
export class GameListComponent implements OnInit {
  categories: Category[];

  games = signal<Game[]>([]);
  filterCategory: Category;
  filterTitle: string;

  nextGameId;

  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(
    private gameService: GameService,
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private authService: AuthService
  ) { }


  ngOnInit(): void {

    this.gameService.getGames().subscribe((games) => {
      this.games.set(games);
      const size = games.length;
      if(this.gameService.getNextGameId()){
        if(size!=0){
          const lastId = games[size-1].id;
          if(lastId>=this.gameService.getNextGameId()){
            this.gameService.setNextGameId(lastId+1);
          }
        }
      }
      else{
        if(size!=0){
          this.gameService.setNextGameId(games[size-1].id +1);
        }
        else{
          this.gameService.setNextGameId(1);
        }
      }
      this.nextGameId = this.gameService.getNextGameId();
    }
    )
    this.filterTitle = null;
    this.filterCategory = null;

    this.categoryService
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
  }

  onCleanFilter(): void {
    this.filterTitle = null;
    this.filterCategory = null;
    this.onSearch();
  }

  onSearch(): void {
    const title = this.filterTitle;
    const categoryId =
      this.filterCategory != null ? this.filterCategory.id : null;


    this.gameService
      .getGames(title, categoryId)
      .subscribe((games) => (this.games.set(games)));

  }


  private openEditCreateModal(data: editCreateDataModel<Game>) {
    const dialogRef = this.dialog.open(GameEditComponent, {
      data: data,
    });
    return dialogRef;
  }

  createGame() {
    let game = new Game();
    game.id = this.nextGameId;
    const dialogRef = this.openEditCreateModal(
      {
        object: game,
        editMode: false
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  editGame(game: Game) {
    //console.log(game);
    const dialogRef = this.openEditCreateModal(
      {
        object: game,
        editMode: true
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      this.onSearch();
    });
  }
}
