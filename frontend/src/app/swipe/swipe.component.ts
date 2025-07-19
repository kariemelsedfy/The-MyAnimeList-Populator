import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TinderUIComponent } from '../tinder-ui/tinder-ui.component';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrl: './swipe.component.css',
  imports: [IonicModule, CommonModule, TinderUIComponent]
})
export class SwipeComponent {
  cards: any[] = [];

  constructor(private http: HttpClient) {}

  async loadTinderCards() {
    console.log("loading tinder cards");
    const MAL_ACCESS_TOKEN = localStorage.getItem('access_token');
    try {
       const raw: any[] = await firstValueFrom(
        this.http.post<any[]>('http://localhost:3000/api/getSuggestedAnimes', { MAL_ACCESS_TOKEN })
      );

      // transform it into what <tinder‑ui> needs
      this.cards = raw.map(item => {
        // main_picture comes in as a JSON string, so parse it
        const pic = typeof item.main_picture === 'string'
          ? JSON.parse(item.main_picture)
          : item.main_picture;

        return {
          id: item.id,
          img: pic.large || pic.medium || '', // Fallback if large is missing
          title: item.title
        };
      });
      console.log(this.cards);

    } catch (err) {
      console.error('Error fetching suggested animes:', err);
    }

  }


  async reloadingTinderCards() {
    if (this.cards.length > 0) {
      return;
    }
    console.log("reloading tinder cards");
    this.loadTinderCards();
  }
}
