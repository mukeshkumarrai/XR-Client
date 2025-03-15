import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActivityCreateComponent } from './job-activity-create.component';

describe('JobActivityCreateComponent', () => {
  let component: JobActivityCreateComponent;
  let fixture: ComponentFixture<JobActivityCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActivityCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActivityCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
