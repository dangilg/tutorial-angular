
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-header-component',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './headerComponent.html',
  styleUrl: './headerComponent.scss',
})
export class HeaderComponent {
  title = 'tutorial Angular';
}
