import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Field } from '../_interfaces/field';
import { GameService } from '../_services/game.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  fields: Field[];
  update: boolean = false;
  score: Observable<number> | undefined;

  constructor(private gameService: GameService) {
    this.fields = gameService.getFields();
  }

  ngOnInit(): void {
   this.gameService.startGame();
  }

  @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
      this.update = this.gameService.moveEvent(event);
  }

  getScore(): number {
    return this.gameService.getScore();
  }
}
