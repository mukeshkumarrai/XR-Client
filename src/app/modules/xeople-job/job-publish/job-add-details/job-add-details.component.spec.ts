import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAddDetailsComponent } from './job-add-details.component';

describe('JobAddDetailsComponent', () => {
  let component: JobAddDetailsComponent;
  let fixture: ComponentFixture<JobAddDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAddDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAddDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
