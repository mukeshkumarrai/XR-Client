import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobGridTreeViewComponent } from './job-grid-tree-view.component';

describe('JobGridTreeViewComponent', () => {
  let component: JobGridTreeViewComponent;
  let fixture: ComponentFixture<JobGridTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobGridTreeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobGridTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
