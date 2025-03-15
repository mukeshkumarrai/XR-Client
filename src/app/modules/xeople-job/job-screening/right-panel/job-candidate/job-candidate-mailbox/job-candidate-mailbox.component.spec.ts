import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCandidateMailboxComponent } from './job-candidate-mailbox.component';

describe('JobCandidateMailboxComponent', () => {
  let component: JobCandidateMailboxComponent;
  let fixture: ComponentFixture<JobCandidateMailboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCandidateMailboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCandidateMailboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
