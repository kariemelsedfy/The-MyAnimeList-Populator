import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimeProfileComponent } from './anime-profile-form-component.component';

describe('AnimeProfileComponent', () => {
  let component: AnimeProfileComponent;
  let fixture: ComponentFixture<AnimeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
