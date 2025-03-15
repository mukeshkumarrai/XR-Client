import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkflowStagesComponent } from './view-workflow-stages.component';

describe('ViewWorkflowStagesComponent', () => {
  let component: ViewWorkflowStagesComponent;
  let fixture: ComponentFixture<ViewWorkflowStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWorkflowStagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWorkflowStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
