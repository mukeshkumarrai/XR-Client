import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActivityGridComponent } from './job-activity-grid.component';

describe('JobActivityGridComponent', () => {
  let component: JobActivityGridComponent;
  let fixture: ComponentFixture<JobActivityGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActivityGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActivityGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
