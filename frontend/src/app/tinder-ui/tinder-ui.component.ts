import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'tinder-ui',
  templateUrl: './tinder-ui.component.html',
  styleUrls: ['./tinder-ui.component.css'],
  imports: [CommonModule]
})
export class TinderUIComponent implements AfterViewInit {

  @Input('cards') cards!: Array<{
    id: number;
    img: string;
    title: string;
  }>;

  @ViewChildren('tinderCard') tinderCards!: QueryList<ElementRef>;
  tinderCardsArray!: ElementRef[];

  moveOutWidth!: number;
  shiftRequired = false;
  transitionInProgress = false;

  heartVisibilityClassName = '';
  crossVisibilityClassName = '';

  constructor() { }

  ngAfterViewInit(): void {
    this.moveOutWidth = document.documentElement.clientWidth * 1.5;
    this.tinderCardsArray = this.tinderCards.toArray();
    this.tinderCards.changes.subscribe(() => {
      this.tinderCardsArray = this.tinderCards.toArray();
    });
  }

  userClickedButton(event: MouseEvent, heart: boolean): void {
    event.preventDefault();
    if (!this.cards.length) {
      return;
    }

    const card = this.cards[0];

    const cardEl = this.tinderCardsArray[0].nativeElement as HTMLElement;

    if (heart) {
      cardEl.style.transform = `translate(${this.moveOutWidth}px, -100px) rotate(-30deg)`;
      this.toggleChoiceIndicator('', 'visible');

      //Swiped right logic here
      console.log("user swiped right");
      console.log(card)

    } else {
      cardEl.style.transform = `translate(-${this.moveOutWidth}px, -100px) rotate(30deg)`;
      this.toggleChoiceIndicator('visible', '');


      //Swiped left logic here
      console.log("user swiped left");
      console.log(card)
    }

    this.shiftRequired = true;
    this.transitionInProgress = true;
  }

  handlePan(event: any): void {
    if (
      event.deltaX === 0 ||
      (event.center.x === 0 && event.center.y === 0) ||
      !this.cards.length
    ) {
      return;
    }

    if (this.transitionInProgress) {
      this.handleShift();
    }

    const cardEl = this.tinderCardsArray[0].nativeElement as HTMLElement;
    cardEl.classList.add('moving');

    if (event.deltaX > 0) {
      this.toggleChoiceIndicator('', 'visible');
    } else {
      this.toggleChoiceIndicator('visible', '');
    }

    const xMulti = event.deltaX * 0.03;
    const yMulti = event.deltaY / 80;
    const rotate = xMulti * yMulti;

    cardEl.style.transform = `translate(${event.deltaX}px, ${event.deltaY}px) rotate(${rotate}deg)`;
    this.shiftRequired = true;
  }

  handlePanEnd(event: any): void {
    this.toggleChoiceIndicator('', '');
    if (!this.cards.length) {
      return;
    }

    const cardEl = this.tinderCardsArray[0].nativeElement as HTMLElement;
    cardEl.classList.remove('moving');

    const keep =
      Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    if (keep) {
      cardEl.style.transform = '';
      this.shiftRequired = false;
    } else {
      const endX = Math.max(
        Math.abs(event.velocityX) * this.moveOutWidth,
        this.moveOutWidth
      );
      const toX = event.deltaX > 0 ? endX : -endX;
      const endY = Math.abs(event.velocityY) * this.moveOutWidth;
      const toY = event.deltaY > 0 ? endY : -endY;
      const xMulti = event.deltaX * 0.03;
      const yMulti = event.deltaY / 80;
      const rotate = xMulti * yMulti;

      cardEl.style.transform = `translate(${toX}px, ${
        toY + event.deltaY
      }px) rotate(${rotate}deg)`;
      this.shiftRequired = true;
    }

    this.transitionInProgress = true;
  }

  toggleChoiceIndicator(cross: string, heart: string): void {
    this.crossVisibilityClassName = cross;
    this.heartVisibilityClassName = heart;
  }

  handleShift(): void {
    this.transitionInProgress = false;
    this.toggleChoiceIndicator('', '');

    if (this.shiftRequired) {
      this.cards.shift();
      this.shiftRequired = false;
    }
  }
}
