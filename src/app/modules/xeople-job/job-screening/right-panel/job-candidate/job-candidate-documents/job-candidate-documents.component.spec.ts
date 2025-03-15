import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCandidateDocumentsComponent } from './job-candidate-documents.component';

describe('JobCandidateDocumentsComponent', () => {
  let component: JobCandidateDocumentsComponent;
  let fixture: ComponentFixture<JobCandidateDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCandidateDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCandidateDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
