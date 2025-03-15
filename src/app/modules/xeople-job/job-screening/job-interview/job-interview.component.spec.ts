import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInterviewComponent } from './job-interview.component';

describe('JobInterviewComponent', () => {
  let component: JobInterviewComponent;
  let fixture: ComponentFixture<JobInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobInterviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
