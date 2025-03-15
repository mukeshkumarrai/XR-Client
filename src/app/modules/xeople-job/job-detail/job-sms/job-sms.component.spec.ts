import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSmsComponent } from './job-sms.component';

describe('JobSmsComponent', () => {
  let component: JobSmsComponent;
  let fixture: ComponentFixture<JobSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
