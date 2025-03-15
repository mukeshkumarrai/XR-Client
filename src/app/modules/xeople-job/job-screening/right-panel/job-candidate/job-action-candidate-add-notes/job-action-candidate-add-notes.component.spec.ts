import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionCandidateAddNotesComponent } from './job-action-candidate-add-notes.component';

describe('JobActionCandidateAddNotesComponent', () => {
  let component: JobActionCandidateAddNotesComponent;
  let fixture: ComponentFixture<JobActionCandidateAddNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionCandidateAddNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActionCandidateAddNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
