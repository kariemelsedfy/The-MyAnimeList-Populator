import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-oauth-callback',
  template: `
    <div>OAuth code: {{ code }}</div>
    <div>Access Token: {{ token?.access_token }} </div>
  `
})
export class OauthCallbackComponent {
  code: string | null = null;
  token: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.route.queryParamMap.subscribe(params => {
      this.code = params.get('code');
    });

    if (this.code) {
      this.sendCode()
    }
  }

  sendCode() {
    if (!this.code) return;
    this.http.post('http://localhost:3000/api/getToken', { code: this.code })
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
