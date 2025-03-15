import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowCandidateMappedBoxComponent } from './workflow-candidate-mapped-box.component';

describe('WorkflowCandidateMappedBoxComponent', () => {
  let component: WorkflowCandidateMappedBoxComponent;
  let fixture: ComponentFixture<WorkflowCandidateMappedBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowCandidateMappedBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowCandidateMappedBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
