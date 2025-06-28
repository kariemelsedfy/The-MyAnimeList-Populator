import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-oauth-callback',
  template: `
    <div>OAuth code: {{ code }}</div>
  `
})
export class OauthCallbackComponent {
  code: string | null = null;
  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(params => {
      this.code = params.get('code');
    });
  }
}
