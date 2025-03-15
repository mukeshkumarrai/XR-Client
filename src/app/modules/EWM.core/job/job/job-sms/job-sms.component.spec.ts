import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSMSComponent } from './job-sms.component';

describe('JobSMSComponent', () => {
  let component: JobSMSComponent;
  let fixture: ComponentFixture<JobSMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSMSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
