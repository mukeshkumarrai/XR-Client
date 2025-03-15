import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionClientActivityComponent } from './job-action-client-activity.component';

describe('JobActionClientActivityComponent', () => {
  let component: JobActionClientActivityComponent;
  let fixture: ComponentFixture<JobActionClientActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionClientActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActionClientActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
