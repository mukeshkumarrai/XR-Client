import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCandidateResumeComponent } from './job-candidate-resume.component';

describe('JobCandidateResumeComponent', () => {
  let component: JobCandidateResumeComponent;
  let fixture: ComponentFixture<JobCandidateResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCandidateResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCandidateResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
