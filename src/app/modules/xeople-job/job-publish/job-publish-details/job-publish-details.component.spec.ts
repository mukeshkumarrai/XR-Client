import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPublishDetailsComponent } from './job-publish-details.component';

describe('JobPublishDetailsComponent', () => {
  let component: JobPublishDetailsComponent;
  let fixture: ComponentFixture<JobPublishDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPublishDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPublishDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
