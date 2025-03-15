import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCandidateCoverPageComponent } from './job-candidate-cover-page.component';

describe('JobCandidateCoverPageComponent', () => {
  let component: JobCandidateCoverPageComponent;
  let fixture: ComponentFixture<JobCandidateCoverPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCandidateCoverPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCandidateCoverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
