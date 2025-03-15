import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobIndeedPublishedComponent } from './job-indeed-published.component';

describe('JobIndeedPublishedComponent', () => {
  let component: JobIndeedPublishedComponent;
  let fixture: ComponentFixture<JobIndeedPublishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobIndeedPublishedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobIndeedPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
