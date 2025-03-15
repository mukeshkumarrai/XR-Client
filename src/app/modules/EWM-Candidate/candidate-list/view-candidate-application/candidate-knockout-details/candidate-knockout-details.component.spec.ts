import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateKnockoutDetailsComponent } from './candidate-knockout-details.component';

describe('CandidateKnockoutDetailsComponent', () => {
  let component: CandidateKnockoutDetailsComponent;
  let fixture: ComponentFixture<CandidateKnockoutDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateKnockoutDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateKnockoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
