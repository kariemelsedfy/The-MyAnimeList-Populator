import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter
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

  @Output() reloadCards = new EventEmitter<void>();

  @ViewChildren('tinderCard') tinderCards!: QueryList<ElementRef>;
  tinderCardsArray!: ElementRef[];

  moveOutWidth!: number;
  shiftRequired = false;
  transitionInProgress = false;

  heartVisibilityClassName = '';
  crossVisibilityClassName = '';

  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) { }

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

      this.swipeRight(card)

    } else {
      cardEl.style.transform = `translate(-${this.moveOutWidth}px, -100px) rotate(30deg)`;
      this.toggleChoiceIndicator('visible', '');

      this.swipeLeft(card)
      
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



  async swipeLeft(card: { id: number; img: string; title: string }) {
      //Swiped left logic here
      //If the user swiped left, the right course of action would be to delete the user-anime pair from the database.

      const token = localStorage.getItem('access_token');
      const animeID = card.id;


      this.http.post('http://localhost:3000/api/deleteUserAnimeRow', {MAL_ACCESS_TOKEN: token, animeID: animeID}).subscribe({
      next: () => {
        console.log(`Deleted anime ${animeID} for this user.`);
        
        this.reloadCards.emit();
      },
      error: err => {
        console.error('Failed to delete:', err);
      }
    });
  }


  async swipeRight(card: { id: number; img: string; title: string }) {
      //Swiped right logic here
      //The correct logic would be to patch the user's anime list, and THEN, delete the anime-user pair from the database just like swipe left does.
      const score = await this.presentScorePrompt(card);
      const token = localStorage.getItem('access_token');
      const animeID = card.id;
      this.http.post('http://localhost:3000/api/patchAnimeList', {MAL_ACCESS_TOKEN: token, animeID: animeID, score: score}).subscribe({
      next: () => {
        console.log(`Added ${card.title} to anime list with score ${score}.`);

        //delete the anime from the database now that it's patched.
        this.http.post('http://localhost:3000/api/deleteUserAnimeRow', {MAL_ACCESS_TOKEN: token, animeID: animeID}).subscribe({
        next: () => {
          this.reloadCards.emit();
          console.log(`Deleted anime ${animeID} for this user.`);
        },
        error: err => {
          console.error('Failed to delete:', err);
        }
      });

      },
      error: err => {
        console.error('Failed to delete:', err);
      }
    });
      

  }

  private async presentScorePrompt(
  card: { id: number; img: string; title: string },
): Promise<number> {
  const alert = await this.alertController.create({
    header:  `Rate "${card.title}"`,
    message: `You swiped right. What's the rating? (1-10)?`,
    inputs: [{
      name:        'score',
      type:        'number',
      placeholder: '1 to 10',
      min:          1,
      max:         10
    }],
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'OK',
        handler: () => {}
      }
    ]
  });

  await alert.present();
  const { data } = await alert.onDidDismiss();
  const raw = data.values?.score ?? '';
  const num = parseInt(raw, 10);
  return isNaN(num) ? 0 : num;
}

}
