import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgIf, NgFor, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-anime-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, JsonPipe],
  templateUrl: './anime-profile-form-component.component.html',
  styleUrl: './anime-profile-form-component.component.css'
})
export class AnimeProfileComponent {
  currentStep = 1;
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

  ngOnInit() {
    this.goToStep(1);
  }

  goToStep(n: number) {
    this.currentStep = n;
    // mark which .step is active
    document.querySelectorAll('.step').forEach((el, idx) => {
      el.classList.toggle('active', idx + 1 === n);
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
