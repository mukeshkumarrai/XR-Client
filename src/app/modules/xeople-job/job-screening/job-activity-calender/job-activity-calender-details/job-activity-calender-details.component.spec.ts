import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActivityCalenderDetailsComponent } from './job-activity-calender-details.component';

describe('JobActivityCalenderDetailsComponent', () => {
  let component: JobActivityCalenderDetailsComponent;
  let fixture: ComponentFixture<JobActivityCalenderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActivityCalenderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActivityCalenderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
