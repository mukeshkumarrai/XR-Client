import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPublishPopupComponent } from './job-publish-popup.component';

describe('JobPublishPopupComponent', () => {
  let component: JobPublishPopupComponent;
  let fixture: ComponentFixture<JobPublishPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPublishPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPublishPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
