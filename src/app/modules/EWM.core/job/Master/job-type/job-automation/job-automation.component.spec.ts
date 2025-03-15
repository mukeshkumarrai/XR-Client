import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAutomationComponent } from './job-automation.component';

describe('JobAutomationComponent', () => {
  let component: JobAutomationComponent;
  let fixture: ComponentFixture<JobAutomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAutomationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
