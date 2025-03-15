import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockoutQuestionsComponent } from './knockout-questions.component';

describe('KnockoutQuestionsComponent', () => {
  let component: KnockoutQuestionsComponent;
  let fixture: ComponentFixture<KnockoutQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnockoutQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockoutQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
