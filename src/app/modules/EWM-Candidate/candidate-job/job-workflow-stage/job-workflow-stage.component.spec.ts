import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobWorkflowStageComponent } from './job-workflow-stage.component';

describe('JobWorkflowStageComponent', () => {
  let component: JobWorkflowStageComponent;
  let fixture: ComponentFixture<JobWorkflowStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobWorkflowStageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobWorkflowStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
