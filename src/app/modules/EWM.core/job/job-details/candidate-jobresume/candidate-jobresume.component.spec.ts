import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateJobResumeComponent } from './candidate-jobresume.component';

describe('CandidateJobResumeComponent', () => {
  let component: CandidateJobResumeComponent;
  let fixture: ComponentFixture<CandidateJobResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateJobResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateJobResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
