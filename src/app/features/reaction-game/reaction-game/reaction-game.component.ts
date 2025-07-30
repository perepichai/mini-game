import {
  Component,
  inject,
  model,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { GameService } from '../../../core/services/game-service';
import { SquareComponent } from '../square/square.component';
import { FormsModule } from '@angular/forms';
import { ISquareConfig } from '../interfaces/square.interface';
import { gameConfig } from '../../../shared/config/game.config';
import { ScoreComponent } from '../score/score.component';

@Component({
  selector: 'app-reaction-game',
  imports: [FormsModule, SquareComponent, ScoreComponent],
  templateUrl: './reaction-game.component.html',
  styleUrl: './reaction-game.component.scss',
})
export class ReactionGameComponent implements OnInit {
  protected readonly squareConfigs = signal<ISquareConfig[]>([]);
  protected readonly timer = model<number>(gameConfig.defaultTimerMS);

  protected successScore!: Signal<number>;
  protected failScore!: Signal<number>;
  protected isGameActive!: Signal<boolean>;

  private readonly gameService = inject(GameService);

  ngOnInit(): void {
    this.gameService.initSquareConfigs(gameConfig.defaultSquareQuantity);
    this.squareConfigs.set(this.gameService.getSquareConfigs());
    this.successScore = this.gameService.getSuccessScore();
    this.failScore = this.gameService.getFailScore();
    this.isGameActive = this.gameService.getGameStatus();
  }

  startGame(): void {
    this.gameService.startGame(this.timer());
  }

  selectSquare(id: number): void {
    this.gameService.selectSquare(id);
  }
}
