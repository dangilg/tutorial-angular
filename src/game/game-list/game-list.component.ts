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

  nextGameId: number;

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
      this.nextGameId=this.games().length+1;
    }
  )

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

  createGame() {

    const dialogRef = this.dialog.open(GameEditComponent, {
      data: {newId: this.nextGameId},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  editGame(game: Game) {
    const dialogRef = this.dialog.open(GameEditComponent, {
      data: { game: game },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.onSearch();
    });
  }
}
