import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateWorkflowStagesMappedJobdetailsPopComponent } from './candidate-workflow-stages-mapped-jobdetails-pop.component';

describe('CandidateWorkflowStagesMappedJobdetailsPopComponent', () => {
  let component: CandidateWorkflowStagesMappedJobdetailsPopComponent;
  let fixture: ComponentFixture<CandidateWorkflowStagesMappedJobdetailsPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateWorkflowStagesMappedJobdetailsPopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateWorkflowStagesMappedJobdetailsPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
