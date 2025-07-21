import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIf, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-oauth-callback',
  templateUrl: './oauth-callback.component.html', 
  styleUrl: './oauth-callback.component.css',
  imports: [NgIf, JsonPipe]
})
export class OauthCallbackComponent {
  code: string | null = null;
  state: string | null = null;
  token: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.route.queryParamMap.subscribe(params => {
      this.code = params.get('code');
      this.state = params.get('state');
    });

    if (this.code) {
      this.sendCode()
    }
  }

  sendCode() {
    if (!this.code) return;
    this.http.post('http://localhost:3000/api/getToken', { code: this.code, state: this.state })
      .subscribe({
        next: (data) => { 
          this.token = data;
          localStorage.setItem('access_token', this.token.access_token);
          //Check if user in database or not first and depending on that navigate.
          this.http.post<{ exists: boolean }>('http://localhost:3000/api/databaseContainsUser', {MAL_ACCESS_TOKEN: this.token.access_token}).subscribe({
            next: response => {
              if (response.exists) {
                this.router.navigate(['/swipe']);
              } else {
                this.router.navigate(['/suggestion-builder-form']);
              }
            },
            error: err => {
                console.error('checkUser failed', err);
                // fallback navigation
                this.router.navigate(['/']);
              }
          });
        },
        error: (err) => console.error('Token exchange failed', err)
      });
  }
}
