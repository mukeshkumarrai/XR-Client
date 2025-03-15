import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateJobApplicationFormComponent } from './candidate-job-application-form.component';

describe('CandidateJobApplicationFormComponent', () => {
  let component: CandidateJobApplicationFormComponent;
  let fixture: ComponentFixture<CandidateJobApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateJobApplicationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateJobApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
