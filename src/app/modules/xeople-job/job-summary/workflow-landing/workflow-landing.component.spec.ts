import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowLandingComponent } from './workflow-landing.component';

describe('WorkflowLandingComponent', () => {
  let component: WorkflowLandingComponent;
  let fixture: ComponentFixture<WorkflowLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
