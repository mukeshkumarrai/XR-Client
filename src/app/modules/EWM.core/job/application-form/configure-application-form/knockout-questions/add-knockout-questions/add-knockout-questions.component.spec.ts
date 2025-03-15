import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKnockoutQuestionsComponent } from './add-knockout-questions.component';

describe('AddKnockoutQuestionsComponent', () => {
  let component: AddKnockoutQuestionsComponent;
  let fixture: ComponentFixture<AddKnockoutQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddKnockoutQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKnockoutQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
