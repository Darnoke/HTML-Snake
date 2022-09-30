import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Direction } from '../_enum/direction';
import { FieldType } from '../_enum/field-type';
import { Field } from '../_interfaces/field';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  fields: Field[] = [];
  rowLen: number = 7;
  tail: number[] = [];
  direction: Direction = Direction.right;
  appleSpawn: boolean = false;
  score: number = 0;

  constructor() { 
    this.updateFields();
  }

  getFields(): Field[] {
    return this.fields;
  }

  startGame() {
    if(this.tail.length === 0) {
      this.tail.push(Math.floor(Math.random() * this.rowLen * this.rowLen));
      this.updateFields();
      this.appleSpawn = true;
      setTimeout(() => this.gameTick(this.tail), 200);
      setTimeout(() => this.spawnApple(), 1000);
    }
  }

  updateFields() {
    for(let i = 0; i < this.rowLen * this.rowLen; i++) {
      if(this.fields[i] && this.fields[i].type === FieldType.apple) continue;
      this.fields[i] = {type: FieldType.empty};
    }
    for(let i = 0; i < this.tail.length; i++) {
      if(i === 0) this.fields[this.tail[i]].type = FieldType.snakeHead;
      else this.fields[this.tail[i]].type = FieldType.snakeBody;
    }
  }

  moveEvent(event: KeyboardEvent) {
    if(event.key === 'ArrowDown') {
      this.moveDown();
    }
    if(event.key === 'ArrowUp') {
      this.moveUp();
    }
    if(event.key === 'ArrowLeft') {
      this.moveLeft();
    }
    if(event.key === 'ArrowRight') {
      this.moveRight();
    }
    return true;
  }

  moveDown() {
    this.direction = Direction.bot;
  }

  moveUp() {
    this.direction = Direction.top;
  }

  moveLeft() {
    this.direction = Direction.left;
  }

  moveRight() {
    this.direction = Direction.right;
  }

  swapPosition(from: number, to: number) {
    [this.fields[from], this.fields[to]] = [this.fields[to], this.fields[from]];
  }

  addTail(field: number) {
    this.tail.push(field);
  }
  incrementTail(lastPlayerField: number): number { // returns deleted field
    let previous = lastPlayerField;
    for(let i = 0; i < this.tail.length; i++) {
      let temp = previous;
      previous = this.tail[i];
      this.tail[i] = temp; 
    }
    return previous;
  } 

  gameTick(tail: number[]) {
    let currentField: number = tail[0];
    let targetField;
    switch(this.direction) {
      case Direction.right:
        if(currentField % this.rowLen !== this.rowLen - 1) targetField = currentField + 1;
        else targetField = currentField - this.rowLen + 1;
        break;
      case Direction.left:
        if(currentField % this.rowLen !== 0) targetField = currentField - 1;
        else targetField = currentField + this.rowLen - 1;
        break;
      case Direction.top:
        if(currentField >= this.rowLen) targetField = currentField - this.rowLen;
        else targetField = currentField + this.rowLen * (this.rowLen - 1);
        break;
      case Direction.bot:
        if(currentField <= this.rowLen * (this.rowLen - 1) - 1) targetField = currentField + this.rowLen;
        else targetField = currentField - this.rowLen * (this.rowLen - 1);
        break;
    }
    switch(this.fields[targetField].type) {
      case FieldType.empty:
        this.incrementTail(targetField);
        break;
      case FieldType.apple:
        this.score += 10;
        this.addTail(this.incrementTail(targetField));
        break;
      case FieldType.snakeBody:
        this.resetGame()
        return;
    }
    this.updateFields();
    setTimeout(() => this.gameTick(tail), 200);
  }

  spawnApple() {
    if(!this.appleSpawn) return;
    let counter = 100;
    while(counter --) {
      let x = Math.floor(Math.random() * this.rowLen * this.rowLen);
      if(this.fields[x].type === FieldType.empty) {
        this.fields[x].type = FieldType.apple;
        break;
      }
    }
    setTimeout(() => this.spawnApple(), 3000);
  }

  resetGame() {
    this.appleSpawn = false;
    this.tail = [];
    this.score = 0;
    for(let i = 0; i < this.rowLen * this.rowLen; i++) {
      this.fields[i] = {type: FieldType.empty};
    }
    this.updateFields();
    setTimeout(() => this.startGame(), 1500);
  }

  getScore() {
    return this.score;
  }
}
