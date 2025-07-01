import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgIf, NgFor, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-anime-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, JsonPipe],
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
          <label class="block font-semibold mb-2">What genres do you enjoy most?</label>
          <div class="flex flex-wrap gap-2">
            <label *ngFor="let genre of genres; let i = index" class="flex items-center space-x-2">
              <input type="checkbox" [formControl]="likedGenres.controls[i]" />
              <span>{{ genre }}</span>
            </label>
          </div>
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
  genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mecha',
    'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'
  ];

  get likedGenres(): FormArray<FormControl<boolean>> {
    return this.animeForm.get('likedGenres') as FormArray<FormControl<boolean>>;
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.animeForm = this.fb.group({
      startPeriod: [''],
      startAge: [''],
      stillWatching: [''],
      animeCount: [''],
      likedGenres: this.fb.array(this.genres.map(() => this.fb.control(false))),
      seriesLengthPreference: ['']
    });
  }

  onSubmit() {
    this.submitted = true;
    // Convert likedGenres boolean array to genre names
    const selectedGenres = this.likedGenres.value
      .map((checked: boolean, i: number) => checked ? this.genres[i] : null)
      .filter((v: string | null) => v !== null);

    const formValue = { ...this.animeForm.value, likedGenres: selectedGenres, MAL_ACCESS_TOKEN: localStorage.getItem('access_token') };

    this.http.post("http://localhost:3000/api/buildSuggestedAnimeList", formValue)
      .subscribe({
        next: (response) => {
          console.log('Form submitted!', response);
        },
        error: (err) => {
          console.error('Submission failed', err);
        }
      });
  }
}
