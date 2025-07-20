import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-end-page',
  imports: [],
  templateUrl: './end-page.component.html',
  styleUrl: './end-page.component.css'
})
export class EndPageComponent {
  constructor(private router: Router) {}

  restart() {
    this.router.navigate(['/suggestion-builder-form']);
  }

}
