import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailsDiscriptionComponent } from './job-details-discription.component';

describe('JobDetailsDiscriptionComponent', () => {
  let component: JobDetailsDiscriptionComponent;
  let fixture: ComponentFixture<JobDetailsDiscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDetailsDiscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailsDiscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
