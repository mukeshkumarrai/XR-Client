import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionCandidateNotesComponent } from './job-action-candidate-notes.component';

describe('JobActionCandidateNotesComponent', () => {
  let component: JobActionCandidateNotesComponent;
  let fixture: ComponentFixture<JobActionCandidateNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionCandidateNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActionCandidateNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
