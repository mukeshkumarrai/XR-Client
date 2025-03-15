import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateScreeningTimelineComponent } from './candidate-screening-timeline.component';

describe('CandidateScreeningTimelineComponent', () => {
  let component: CandidateScreeningTimelineComponent;
  let fixture: ComponentFixture<CandidateScreeningTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateScreeningTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateScreeningTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
