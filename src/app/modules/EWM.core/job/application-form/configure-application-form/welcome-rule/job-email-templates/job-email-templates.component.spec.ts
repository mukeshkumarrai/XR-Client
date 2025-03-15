import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobEmailTemplatesComponent } from './job-email-templates.component';

describe('JobEmailTemplatesComponent', () => {
  let component: JobEmailTemplatesComponent;
  let fixture: ComponentFixture<JobEmailTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobEmailTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobEmailTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
