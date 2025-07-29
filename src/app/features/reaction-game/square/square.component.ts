import { Component, input } from '@angular/core';
import { State } from '../enums/state.enum';

@Component({
  selector: 'app-square',
  imports: [],
  templateUrl: './square.component.html',
  styleUrl: './square.component.scss',
})
export class SquareComponent {
  protected readonly State = State;

  readonly state = input<State>(State.DEFAULT);
  readonly id = input<number | null>(null);
}
