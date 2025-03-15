import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobWorkflowsComponent } from './job-workflows.component';

describe('JobWorkflowsComponent', () => {
  let component: JobWorkflowsComponent;
  let fixture: ComponentFixture<JobWorkflowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobWorkflowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobWorkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
