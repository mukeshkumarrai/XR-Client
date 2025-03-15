import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowSubStagesComponent } from './workflow-sub-stages.component';

describe('WorkflowSubStagesComponent', () => {
  let component: WorkflowSubStagesComponent;
  let fixture: ComponentFixture<WorkflowSubStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowSubStagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowSubStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
