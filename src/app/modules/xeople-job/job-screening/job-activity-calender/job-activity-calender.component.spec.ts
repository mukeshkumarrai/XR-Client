import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActivityCalenderComponent } from './job-activity-calender.component';

describe('JobActivityCalenderComponent', () => {
  let component: JobActivityCalenderComponent;
  let fixture: ComponentFixture<JobActivityCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActivityCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActivityCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
