import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionDialogComponent } from './job-action-dialog.component';

describe('JobActionDialogComponent', () => {
  let component: JobActionDialogComponent;
  let fixture: ComponentFixture<JobActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobActionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
