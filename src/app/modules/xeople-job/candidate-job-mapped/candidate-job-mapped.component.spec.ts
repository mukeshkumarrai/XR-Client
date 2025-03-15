import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateJobMappedComponent } from './candidate-job-mapped.component';

describe('CandidateJobMappedComponent', () => {
  let component: CandidateJobMappedComponent;
  let fixture: ComponentFixture<CandidateJobMappedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateJobMappedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateJobMappedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
