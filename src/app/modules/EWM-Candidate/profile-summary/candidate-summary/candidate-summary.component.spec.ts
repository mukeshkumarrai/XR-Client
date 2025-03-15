import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSummaryComponent } from './candidate-summary.component';

describe('CandidateSummaryComponent', () => {
  let component: CandidateSummaryComponent;
  let fixture: ComponentFixture<CandidateSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
