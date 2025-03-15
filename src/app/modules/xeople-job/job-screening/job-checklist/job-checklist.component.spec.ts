import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobChecklistComponent } from './job-checklist.component';

describe('JobChecklistComponent', () => {
  let component: JobChecklistComponent;
  let fixture: ComponentFixture<JobChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
