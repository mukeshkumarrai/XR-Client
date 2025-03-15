import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActivityListComponent } from './job-activity-list.component';

describe('JobActivityListComponent', () => {
  let component: JobActivityListComponent;
  let fixture: ComponentFixture<JobActivityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActivityListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
