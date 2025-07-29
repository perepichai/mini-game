import { Component } from '@angular/core';
import { ReactionGameComponent } from './features/reaction-game/reaction-game/reaction-game.component';

@Component({
  selector: 'app-root',
  imports: [ReactionGameComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  protected title = 'mini-game';
}
