import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { gameConfig } from '../../../shared/config/game.config';

@Component({
  selector: 'app-score',
  imports: [],
  template: '<div class="score">{{ score() }}</div>',
  styles: '.score {font-size: 10rem; color: #9699a5;}',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreComponent {
  readonly score = input<number>(gameConfig.startScore);
}
