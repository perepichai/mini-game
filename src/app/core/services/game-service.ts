import { computed, Injectable, signal } from '@angular/core';
import { ISquareConfig } from '../../features/reaction-game/interfaces/square.interface';
import { State } from '../../features/reaction-game/enums/state.enum';
import { interval, Subscription, takeWhile, tap } from 'rxjs';
import { gameConfig } from '../../shared/config/game.config';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private squareQuantity = signal<number>(gameConfig.defaultSquareQuantity);
  private squareConfigs = signal<ISquareConfig[]>([]);
  private currentSquareId = signal<number>(0);

  private successScore = signal<number>(0);
  private failScore = signal<number>(0);
  private maxScore: number = gameConfig.defaultMaxScore;

  private isGameFinished = computed<boolean>(
    () =>
      this.successScore() === this.maxScore ||
      this.failScore() === this.maxScore
  );

  private timer = signal<number>(gameConfig.defaultTimerMS);

  private timerSubscription: Subscription | undefined;

  initSquareConfigs(quantity: number): void {
    const squareArr: ISquareConfig[] = [];

    this.squareQuantity.set(quantity);

    for (let i = 0; i < quantity; i++) {
      squareArr.push({ id: i, state: State.DEFAULT });
    }

    this.squareConfigs.set(squareArr);
  }

  getSquareConfigs(): ISquareConfig[] {
    return this.squareConfigs();
  }

  getCurrentSquareId(): number {
    return this.currentSquareId();
  }

  startGame(timer: number): void {
    this.timer.set(timer);

    if (!this.squareConfigs().length) {
      this.initSquareConfigs(this.squareQuantity());
    }

    this.resetScore();
    this.startTimer();
  }

  selectSquare(id: number): void {
    if (this.isGameFinished()) {
      this.stopTimer();
      return;
    }

    if (this.squareConfigs()[id].state === State.DEFAULT) {
      return;
    }

    if (this.squareConfigs()[id].state === State.SUCCESS) {
      return;
    }

    if (this.squareConfigs()[id].state === State.FAIL) {
      return;
    }

    if (this.currentSquareId() === id) {
      this.addSuccess();
    }

    this.squareConfigs.update((configs) => {
      configs[id].state =
        this.currentSquareId() === id ? State.SUCCESS : State.FAIL;
      return [...configs];
    });

    this.startTimer();
  }

  setMaxScore(score: number): void {
    this.maxScore = score;
  }

  private resetScore(): void {
    this.successScore.set(gameConfig.startScore);
    this.failScore.set(gameConfig.startScore);
  }

  private randomizeCurrentSquareId(): void {
    const getNewId = (max: number) => Math.floor(Math.random() * max);
    let newId: number;

    do {
      newId = getNewId(this.squareConfigs().length);
    } while (this.squareConfigs()[newId].state !== State.DEFAULT);

    this.currentSquareId.set(newId);
  }

  private setCurrentSquare(): void {
    this.randomizeCurrentSquareId();

    this.squareConfigs.update((configs) => {
      configs[this.currentSquareId()].state = State.CURRENT;
      return [...configs];
    });
  }

  private setFailSquare(): void {
    this.squareConfigs.update((configs) => {
      configs[this.currentSquareId()].state = State.FAIL;
      return [...configs];
    });
  }

  private startTimer(): void {
    this.stopTimer();

    if (!this.isGameFinished()) {
      this.setCurrentSquare();
    }

    this.timerSubscription = interval(this.timer())
      .pipe(
        takeWhile(() => !this.isGameFinished()),
        tap(() => {
          this.setFailSquare();
          this.addFail();

          if (!this.isGameFinished()) {
            this.setCurrentSquare();
          }
        })
      )
      .subscribe();
  }

  private stopTimer(): void {
    this.timerSubscription?.unsubscribe();
  }

  private addSuccess(): void {
    this.successScore.update((score) => score + 1);
  }

  private addFail(): void {
    this.failScore.update((score) => score + 1);
  }
}
