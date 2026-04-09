import {Component, Input } from '@angular/core';
import { Game } from '../../model/Game';
import  {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-game-item',
  imports: [MatCardModule],
  templateUrl: './game-item.component.html',
  styleUrl:'./game-item.component.scss',
})
export class GameItemComponent {

  @Input() game:Game;
}
