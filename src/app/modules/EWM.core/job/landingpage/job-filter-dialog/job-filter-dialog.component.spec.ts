import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFilterDialogComponent } from './job-filter-dialog.component';

describe('JobFilterDialogComponent', () => {
  let component: JobFilterDialogComponent;
  let fixture: ComponentFixture<JobFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobFilterDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
