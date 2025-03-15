import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCandidateActivityComponent } from './job-candidate-activity.component';

describe('JobCandidateActivityComponent', () => {
  let component: JobCandidateActivityComponent;
  let fixture: ComponentFixture<JobCandidateActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCandidateActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCandidateActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
