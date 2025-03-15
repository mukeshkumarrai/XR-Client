import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFinalSummaryComponent } from './review-final-summary.component';

describe('ReviewFinalSummaryComponent', () => {
  let component: ReviewFinalSummaryComponent;
  let fixture: ComponentFixture<ReviewFinalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewFinalSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFinalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
