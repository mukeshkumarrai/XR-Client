import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPublishIndeedDetailsComponent } from './job-publish-indeed-details.component';

describe('JobPublishIndeedDetailsComponent', () => {
  let component: JobPublishIndeedDetailsComponent;
  let fixture: ComponentFixture<JobPublishIndeedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPublishIndeedDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPublishIndeedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
