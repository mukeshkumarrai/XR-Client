import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobWorkflowsManageComponent } from './job-workflows-manage.component';

describe('JobWorkflowsManageComponent', () => {
  let component: JobWorkflowsManageComponent;
  let fixture: ComponentFixture<JobWorkflowsManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobWorkflowsManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobWorkflowsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
