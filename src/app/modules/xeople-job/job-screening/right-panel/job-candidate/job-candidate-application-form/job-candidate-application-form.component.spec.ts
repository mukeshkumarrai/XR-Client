import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCandidateApplicationFormComponent } from './job-candidate-application-form.component';

describe('JobCandidateApplicationFormComponent', () => {
  let component: JobCandidateApplicationFormComponent;
  let fixture: ComponentFixture<JobCandidateApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCandidateApplicationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCandidateApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
