import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCandidateKeyWordSearchComponent } from './job-candidate-key-word-search.component';

describe('JobCandidateKeyWordSearchComponent', () => {
  let component: JobCandidateKeyWordSearchComponent;
  let fixture: ComponentFixture<JobCandidateKeyWordSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCandidateKeyWordSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCandidateKeyWordSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
