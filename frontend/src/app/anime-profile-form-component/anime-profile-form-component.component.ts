import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-anime-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, JsonPipe],
  template: `
    <div class="p-4 max-w-xl mx-auto">
      <h2 class="text-xl font-bold mb-4">Anime Watch History</h2>
      <form [formGroup]="animeForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block font-semibold">When did you start watching anime?</label>
          <input type="text" formControlName="startPeriod" class="w-full p-2 border rounded" placeholder="e.g., early 2000s, 2010s..." />
        </div>

        <div>
          <label class="block font-semibold">How old were you when you first watched anime?</label>
          <input type="number" formControlName="startAge" class="w-full p-2 border rounded" />
        </div>

        <div>
          <label class="block font-semibold">Do you still watch anime regularly?</label>
          <select formControlName="stillWatching" class="w-full p-2 border rounded">
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="sometimes">Sometimes</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold">How many anime do you think you've watched?</label>
          <select formControlName="animeCount" class="w-full p-2 border rounded">
            <option value="<10">&lt;10</option>
            <option value="10-30">10–30</option>
            <option value="30-100">30–100</option>
            <option value=">100">100+</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold">What genres do you enjoy most?</label>
          <input type="text" formControlName="likedGenres" class="w-full p-2 border rounded" placeholder="e.g., action, romance, slice of life..." />
        </div>

        <div>
          <label class="block font-semibold">Are there any genres you dislike or avoid?</label>
          <input type="text" formControlName="dislikedGenres" class="w-full p-2 border rounded" placeholder="e.g., horror, mecha..." />
        </div>

        <div>
          <label class="block font-semibold">Do you like long-running series or short/seasonal anime?</label>
          <select formControlName="seriesLengthPreference" class="w-full p-2 border rounded">
            <option value="long">Long-running</option>
            <option value="short">Short/Seasonal</option>
            <option value="both">Both</option>
          </select>
        </div>

        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">Submit</button>
      </form>

      <div *ngIf="submitted" class="mt-6">
        <h3 class="text-lg font-bold mb-2">Form Submitted:</h3>
        <pre>{{ animeForm.value | json }}</pre>
      </div>
    </div>
  `
})
export class AnimeProfileComponent {
  animeForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.animeForm = this.fb.group({
      startPeriod: [''],
      startAge: [''],
      stillWatching: [''],
      animeCount: [''],
      likedGenres: [''],
      dislikedGenres: [''],
      seriesLengthPreference: ['']
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.animeForm.value);
  }
}
